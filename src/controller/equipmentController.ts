import { Request, Response } from "express";
import { BadRequestError } from "../logger/exceptions";
import { CreateEquipmentOwnershipSchema, equipmentData } from "../validator/authValidator";
import { sanitizeInput } from "../utils/helperFunction";
import { getFileUrls } from "../utils/fileHandler";
import { prismaclient } from "../lib/prisma-connect";

const prisma = prismaclient;

// =======================================================
// GET ALL EQUIPMENT
// =======================================================
export const getAllEquipment = async (req: Request, res: Response) => {
  const equipment = await prisma.equipment.findMany({
    include: {
      ownerships: {
        where: { isCurrent: true },
        select: { startDate: true },
      },
      inspections: {
        select: { datePerformed: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({
    success: true,
    data: equipment,
  });
};

// =======================================================
// GET EQUIPMENT BY ID
// =======================================================
export const getEquipmentById = async (req: Request, res: Response) => {
  let { id } = req.params;
  id = sanitizeInput(id);

  const equipment = await prisma.equipment.findUnique({
    where: { id },
    include: {
      ownerships: {
        select: {
          startDate: true,
          conditionAtAssignment: true,
          primaryDuties: true,
          operator: true,
          documents: true,
        },
      },
      conditionHistory: {
        include: { recordedBy: true },
        orderBy: { date: "desc" },
      },
      inspections: {
        include: { inspector: true },
        orderBy: { datePerformed: "desc" },
      },
      documents: {
        select: { fileName: true, fileUrl: true },
      },
      operators: true,
    },
  });

  if (!equipment) throw new BadRequestError("Equipment not found");

  res.status(200).json({
    success: true,
    equipment,
  });
};

// =======================================================
// CREATE NEW EQUIPMENT
// =======================================================
export const createEquipment = async (req: Request, res: Response) => {
  const data = equipmentData.parse(req.body);

  // Check if equipment already exists
  const existingEquipment = await prisma.equipment.findFirst({
    where: { chasisNumber: data.chasisNumber },
  });

  if (existingEquipment) {
    throw new BadRequestError("Equipment with this chassis number already exists");
  }

  const result = await prisma.$transaction(async (tx) => {
    // Create the equipment
    const equipment = await tx.equipment.create({
      data: { ...data },
    });

    // Handle document uploads (if any)
    if (req.files && Object.keys(req.files).length > 0) {
      const uploadedFiles = Object.values(req.files).flat();
      const structuredFiles = getFileUrls(uploadedFiles as Express.Multer.File[], "equipment", equipment.id);

      await tx.document.createMany({
        data: structuredFiles.map((file) => ({
          fileName: file.fileName,
          fileUrl: file.fileUrl,
          keyId: file.keyId,
          keyValue: file.keyValue,
          fileType: file.fileType || "unknown",
          fileSize: file.fileSize || 0,
        })),
      });
    }

    return equipment;
  });

  res.status(201).json({
    success: true,
    message: "Equipment created successfully",
  });
};

// =======================================================
// UPDATE EQUIPMENT
// =======================================================
export const updateEquipment = async (req: Request, res: Response) => {
  let { id } = req.params;
  id = sanitizeInput(id);
  const data = equipmentData.parse(req.body);

  const equipment = await prisma.equipment.findFirst({ where: { id } });
  if (!equipment) throw new BadRequestError("Equipment not found");

  await prisma.$transaction(async (tx) => {
    // Update equipment info
    await tx.equipment.update({
      where: { id },
      data: { ...data },
    });

    // If files were uploaded, create or update corresponding records
    if (req.files && Object.keys(req.files).length > 0) {
      const uploadedFiles = Object.values(req.files).flat();
      const structuredFiles = getFileUrls(uploadedFiles as Express.Multer.File[], "equipment", equipment.id);

      for (const file of structuredFiles) {
        const existingDoc = await tx.document.findFirst({
          where: { equipmentId: equipment.id, fileName: file.fileName },
        });

        if (existingDoc) {
          await tx.document.update({
            where: { id: existingDoc.id },
            data: { fileUrl: file.fileUrl, fileSize: file.fileSize || 0, fileType: file.fileType || "unknown" },
          });
        } else {
          await tx.document.create({ data: file });
        }
      }
    }
  });

  res.status(200).json({
    success: true,
    message: "Equipment updated successfully",
  });
};

// =======================================================
// DELETE EQUIPMENT
// =======================================================
export const deleteEquipment = async (req: Request, res: Response) => {
  let { id } = req.params;
  id = sanitizeInput(id);

  const equipment = await prisma.equipment.findFirst({ where: { id } });
  if (!equipment) throw new BadRequestError("Equipment not found");

  await prisma.equipment.delete({ where: { id } });

  res.status(200).json({
    success: true,
    message: "Equipment deleted successfully",
  });
};

// =======================================================
// CREATE EQUIPMENT OWNERSHIP
// =======================================================
export const createEquipmentOwnership = async (req: Request, res: Response) => {
  const user: any = req.user;
  const validatedData = CreateEquipmentOwnershipSchema.parse(req.body);

  const data = {
    ...validatedData,
    userId: user.id,
    startDate: validatedData.startDate ? new Date(validatedData.startDate) : new Date(),
    endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
  };

  const equipment = await prisma.equipment.findFirst({ where: { id: data.equipmentId } });
  if (!equipment) throw new BadRequestError("No equipment found");

  const operator = await prisma.operator.findFirst({ where: { id: data.operatorId } });
  if (!operator) throw new BadRequestError("No operator found");

  await prisma.$transaction(async (tx) => {
    await tx.equipmentOwnership.updateMany({
      where: { equipmentId: equipment.id, isCurrent: true },
      data: { isCurrent: false, endDate: new Date() },
    });

    const ownership = await tx.equipmentOwnership.create({ data });

    // Handle any attached ownership documents
    if (req.files && Object.keys(req.files).length > 0) {
      const uploadedFiles = Object.values(req.files).flat();
      const structuredFiles = getFileUrls(uploadedFiles as Express.Multer.File[], "equipmentOwnership", ownership.id);

      await tx.document.createMany({
        data: structuredFiles.map((file) => ({
          ...file,
          fileType: file.fileType || "unknown",
          fileSize: file.fileSize || 0,
        })),
      });
    }
  });

  res.status(201).json({
    success: true,
    message: "Equipment ownership created successfully",
  });
};

// =======================================================
// GET EQUIPMENT OWNERSHIPS
// =======================================================
export const getEquipmentOwnerships = async (req: Request, res: Response) => {
  const { id } = req.params;

  const equipment = await prisma.equipment.findUnique({ where: { id } });
  if (!equipment) throw new BadRequestError("Equipment not found");

  const ownerships = await prisma.equipmentOwnership.findMany({
    where: { equipmentId: id },
    include: {
      assignedBy: {
        select: {
          firstName: true,
          lastName: true,
          serviceNumber: true,
          email: true,
          rank: true,
          unit: true,
        },
      },
      documents: {
        select: {
          id: true,
          fileName: true,
          fileUrl: true,
          createdAt: true,
        },
      },
      operator: {
        select: {
          id: true,
          serviceNumber: true,
          firstName: true,
          lastName: true,
          officialEmailAddress: true,
          phoneNumber: true,
          branch: true,
          position: true,
        },
      },
    },
  });

  res.status(200).json({
    success: true,
    data: ownerships,
  });
};
