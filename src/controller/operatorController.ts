import { Request, Response } from "express";
import { BadRequestError, unAuthorizedError } from "../logger/exceptions";
import { sanitizeInput } from "../utils/helperFunction";
import { operatorSchema } from "../validator/authValidator";
import { prismaclient } from "../lib/prisma-connect";
import { getFileUrls } from "../utils/fileHandler";

const prisma = prismaclient;

/**
 * Get all operators
 */
export const getAllOperator = async (req: Request, res: Response) => {
  const user: any = req.user;
  if (user.role === "OFFICER") throw new unAuthorizedError();

  const operators = await prisma.operator.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({
    success: true,
    data: operators,
  });
};

/**
 * Get operator by ID
 */
export const getAllOperatorById = async (req: Request, res: Response) => {
  let { id } = req.params;
  id = sanitizeInput(id);

  const user: any = req.user;
  if (user.role === "OFFICER") throw new unAuthorizedError();

  const operator = await prisma.operator.findUnique({
    where: { id },
    include: {
      documents: {
        select: {
          id: true,
          fileName: true,
          fileUrl: true,
          fileType: true,
          fileSize: true,
          createdAt: true,
        },
      },
    },
  });

  if (!operator) throw new BadRequestError("Operator not found");

  res.status(200).json({
    success: true,
    operator,
  });
};

/**
 * Create a new operator
 */
export const createOperator = async (req: Request, res: Response) => {
  const user: any = req.user;
  if (user.role === "OFFICER") throw new unAuthorizedError();

  const validated = operatorSchema.parse(req.body);

  // Check for duplicates
  const existing = await prisma.operator.findFirst({
    where: { serviceNumber: validated.serviceNumber },
  });
  if (existing) throw new BadRequestError("Operator already exists");

  await prisma.$transaction(async (tx) => {
    const operator = await tx.operator.create({
      data: validated,
    });

    // Handle uploaded documents
    if (req.files && Object.keys(req.files).length > 0) {
      const uploadedFiles = Object.values(req.files).flat();
      const structuredFiles = getFileUrls(
        uploadedFiles as Express.Multer.File[],
        "operatorId",
        operator.id
      );

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
    message: "Operator created successfully",
  });
};

/**
 * Update operator details
 */
export const updateOperator = async (req: Request, res: Response) => {
  const user: any = req.user;
  if (user.role === "OFFICER") throw new unAuthorizedError();

  let { id } = req.params;
  id = sanitizeInput(id);

  const operator = await prisma.operator.findUnique({ where: { id } });
  if (!operator) throw new BadRequestError("Operator not found");

  await prisma.$transaction(async (tx) => {
    // Update operator info
    await tx.operator.update({
      where: { id },
      data: operatorSchema.parse(req.body),
    });

    // Handle file updates
    if (req.files && Object.keys(req.files).length > 0) {
      const uploadedFiles = Object.values(req.files).flat();
      const structuredFiles = getFileUrls(
        uploadedFiles as Express.Multer.File[],
        "operatorId",
        operator.id
      );

      for (const file of structuredFiles) {
        const existing = await tx.document.findFirst({
          where: { operatorId: operator.id, fileName: file.fileName },
        });

        if (existing) {
          await tx.document.update({
            where: { id: existing.id },
            data: { fileUrl: file.fileUrl, fileType: file.fileType, fileSize: file.fileSize },
          });
        } else {
          await tx.document.create({
            data: file,
          });
        }
      }
    }
  });

  res.status(200).json({
    success: true,
    message: "Operator updated successfully",
  });
};

/**
 * Delete operator
 */
export const deleteOperator = async (req: Request, res: Response) => {
  const user: any = req.user;
  if (user.role === "OFFICER") throw new unAuthorizedError();

  let { id } = req.params;
  id = sanitizeInput(id);

  const operator = await prisma.operator.findUnique({ where: { id } });
  if (!operator) throw new BadRequestError("Operator not found");

  await prisma.operator.delete({ where: { id } });

  res.status(200).json({
    success: true,
    message: "Operator deleted successfully",
  });
};
