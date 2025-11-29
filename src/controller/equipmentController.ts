import { Request, Response } from "express";
import { BadRequestError, unAuthorizedError } from "../logger/exceptions";
import { CreateEquipmentOwnershipSchema,equipmentData, UpdateEquipmentOwnershipSchema } from "../schema/euipmentSchema";
import { sanitizeInput } from "../utils/helperFunction";
import { getFileUrls } from "../utils/fileHandler";
import { prismaclient } from "../lib/prisma-connect";
import { User } from "../generated/prisma";

// =======================================================
// GET EQUIPMENT WITH QUERIES AND PAGINATION
// =======================================================
export const getEquipmentController = async (req: Request, res: Response) => {
  const {
    page = "1",
    limit = "10",
    search,
    equipmentType,
    equipmentCategory,
    manufacturer,
    acquisitionMethod,
    currentCondition,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  // Build where clause
  const where: any = {};

  if (search) {
    where.OR = [
      { equipmentName: { contains: search as string } },
      { chasisNumber: { contains: search as string } },
      { model: { contains: search as string } },
      { manufacturer: { contains: search as string } },
    ];
  }

  if (equipmentType) where.equipmentType = equipmentType;
  if (equipmentCategory) where.equipmentCategory = equipmentCategory;
  if (manufacturer) where.manufacturer = manufacturer;
  if (acquisitionMethod) where.acquisitionMethod = acquisitionMethod;
  if (currentCondition) where.currentCondition = currentCondition;

  // Build orderBy
  const orderBy: any = {};
  orderBy[sortBy as string] = sortOrder;

  const [equipment, total] = await Promise.all([
    prismaclient.equipment.findMany({
      where,
      include: {
        ownerships: {
          where: { isCurrent: true },
          select: {
            startDate: true,
            operator: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                serviceNumber: true,
              },
            },
          },
        },
        inspections: {
          select: { datePerformed: true, overallCondition: true },
          orderBy: { datePerformed: "desc" },
          take: 1,
        },
      },
      orderBy,
      skip,
      take: limitNum,
    }),
    prismaclient.equipment.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    data: equipment,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
};

// =======================================================
// GET EQUIPMENT BY ID
// =======================================================
export const getEquipmentById = async (req: Request, res: Response) => {
  let { id } = req.params;
  id = sanitizeInput(id);

  const equipment = await prismaclient.equipment.findUnique({
    where: { id },
    include: {
      ownerships: {
        select: {
          id: true,
          startDate: true,
          endDate: true,
          isCurrent: true,
          conditionAtAssignment: true,
          primaryDuties: true,
          operator: true,
          assignedBy: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              rank: true,
            },
          },
          documents: true,
        },
        orderBy: { startDate: "desc" },
      },
      conditionHistory: {
        include: {
          recordedBy: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { date: "desc" },
      },
      inspections: {
        include: {
          inspector: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { datePerformed: "desc" },
      },
      documents: {
        select: { id: true, fileName: true, fileUrl: true, fileType: true, fileSize: true, createdAt: true },
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
  const user = req.user as User;
  const data = equipmentData.parse(req.body);
  const IdempotencyKey = req.IdempotencyKey as string;
  

  // If idempotency key is provided, check for existing equipment
  if (IdempotencyKey) {
    const existingEquipment = await prismaclient.equipment.findFirst({
      where: {
        OR: [
          { chasisNumber: data.chasisNumber },
          { idempotency_tracker: { some: { key: IdempotencyKey } } }, 
        ],
      },
    });

    if (existingEquipment) {
    return res.status(201).json({
    success: true,
    message: "Equipment created successfully",
  });
    }
  }

  // Check if equipment with chassis number already exists
  const existingEquipment = await prismaclient.equipment.findFirst({
    where: { chasisNumber: data.chasisNumber },
  });

  if (existingEquipment) {
    throw new BadRequestError("Equipment with this chassis number already exists");
  }



  const result = await prismaclient.$transaction(async (tx) => {
    const equipmentCategory = await tx.equipmentCategory.findUnique({
      where: { name: data.equipmentCategory?.toLowerCase() },
    });
    if (!equipmentCategory && data.equipmentCategory) {
      await tx.equipmentCategory.create({
        data: { name: data.equipmentCategory?.toLowerCase() },
      });
    }

    const equipment = await tx.equipment.create({
      data: { ...data,
        addedById: user.id,
        createdAt: new Date(),
        
       },
    });

    // Handle document uploads (if any)
    if (req.files && Object.keys(req.files).length > 0) {
      const uploadedFiles = Object.values(req.files).flat();
      const structuredFiles = getFileUrls(uploadedFiles as Express.Multer.File[], "equipmentId", equipment.id);

      await tx.document.createMany({
        data: structuredFiles.map((file) => ({
          fileName: file.fileName,
          fileUrl: file.fileUrl,
          equipmentId: equipment.id,
          fileType: file.fileType || "unknown",
          fileSize: file.fileSize || 0,
        })),
      });
    }

    // Create idempotency tracker if key provided
    if (IdempotencyKey) {
      await tx.idempotency_tracker.create({
        data: {
          key: IdempotencyKey,
          equipment_id: equipment.id
        },
      });
    }

    return equipment;
  });

  res.status(201).json({
    success: true,
    message: "Equipment created successfully",
  });
};


export const getEquipmentCategories = async (req: Request, res: Response) => {
  const categories = await prismaclient.equipmentCategory.findMany({
    orderBy: { name: "asc" },
  }); 
  res.status(200).json({
    success: true,
    data: categories,
  });
}

// =======================================================
// UPDATE EQUIPMENT
// =======================================================
export const updateEquipment = async (req: Request, res: Response) => {
  let { id } = req.params;
  id = sanitizeInput(id);
  const data = equipmentData.parse(req.body);

  const equipment = await prismaclient.equipment.findFirst({ where: { id } });
  if (!equipment) throw new BadRequestError("Equipment not found");

  await prismaclient.$transaction(async (tx) => {
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
          await tx.document.create({
            data: {
              fileName: file.fileName,
              fileUrl: file.fileUrl,
              equipmentId: equipment.id,
              fileType: file.fileType || "unknown",
              fileSize: file.fileSize || 0,
            },
          });
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
// export const deleteEquipment = async (req: Request, res: Response) => {
//   let { id } = req.params;
//   id = sanitizeInput(id);

//   const equipment = await prismaclient.equipment.findFirst({ where: { id } });
//   if (!equipment) throw new BadRequestError("Equipment not found");

//   await prismaclient.equipment.delete({ where: { id } });

//   res.status(200).json({
//     success: true,
//     message: "Equipment deleted successfully",
//   });
// };

// =======================================================
// CREATE EQUIPMENT OWNERSHIP 
// =======================================================
export const createEquipmentOwnership = async (req: Request, res: Response) => {
  const user = req.user as User;
  const validatedData = CreateEquipmentOwnershipSchema.parse(req.body);

  const data = {
    ...validatedData,
    startDate: validatedData.startDate ? new Date(validatedData.startDate) : new Date(),
    endDate: validatedData.endDate ? new Date(validatedData.endDate) : new Date(),
  };


  const equipment = await prismaclient.equipment.findFirst({ where: { id: data.equipmentId } });
  if (!equipment) throw new BadRequestError("No equipment found");

  const operator = await prismaclient.operator.findFirst({ where: { id: data.operatorId } });
  if (!operator) throw new BadRequestError("No operator found");

  const result = await prismaclient.$transaction(async (tx) => {
    await tx.equipmentOwnership.updateMany({
      where: { equipmentId: equipment.id, isCurrent: true },
      data: { isCurrent: false, endDate: new Date() },
    });

    const ownership = await tx.equipmentOwnership.create({
      data: {
       ...data,
       assignedByID: user.id,
       createdAt: new Date(),
       isCurrent: true,
      }

       });

    // Handle any attached ownership documents
    if (req.files && Object.keys(req.files).length > 0) {
      const uploadedFiles = Object.values(req.files).flat();
      const structuredFiles = getFileUrls(uploadedFiles as Express.Multer.File[], "ownershipId", ownership.id);

      await tx.document.createMany({
        data: structuredFiles.map((file) => ({
          ...file,
          ownershipId: ownership.id,
          fileType: file.fileType || "unknown",
          fileSize: file.fileSize || 0,
        })),
      });
    }

    return ownership;
  });

  res.status(201).json({
    success: true,
    message: "Equipment ownership created successfully",
  });
};

export const unassignEquipmentOwnership = async (req: Request, res: Response) => {
    const user = req.user as User;
    
  const validatedData = UpdateEquipmentOwnershipSchema.parse(req.params)


  const equipment = await prismaclient.equipment.findFirst({ where: { id: validatedData.equipmentId } });
  if (!equipment) throw new BadRequestError("No equipment found");

  const operator = await prismaclient.operator.findFirst({ where: { id: validatedData.operatorId } });
  if (!operator) throw new BadRequestError("No operator found");

    await prismaclient.equipmentOwnership.updateMany({
      where: { 
        equipmentId: equipment.id,
        isCurrent: true,
        operatorId: validatedData.operatorId
      },
      data: { isCurrent: false, endDate: new Date() },
    });

    res.status(201).json({
    success: true,
    message: "Equipment ownership created successfully",
  });


}

// =======================================================
// GET EQUIPMENT OWNERSHIPS
// =======================================================
export const getEquipmentOwnerships = async (req: Request, res: Response) => {
  const { id } = req.params;

  const equipment = await prismaclient.equipment.findUnique({ where: { id } });
  if (!equipment) throw new BadRequestError("Equipment not found");

  const ownerships = await prismaclient.equipmentOwnership.findMany({
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
    orderBy: { startDate: "desc" },
  });

  res.status(200).json({
    success: true,
    data: ownerships,
  });
};

// =======================================================
// UPDATE EQUIPMENT OWNERSHIPS RECORDS
// =======================================================

export const updateEquipmentOwnerships = async (req: Request, res: Response) => {
  const user = req.user as User;
  const { ownershipId } = req.params;

  if (!ownershipId) throw new BadRequestError("Ownership ID is required");
  if( user.role !== "PLATADMIN") throw new unAuthorizedError("User not authorized");
  // Allow partial updates
  const validatedData = UpdateEquipmentOwnershipSchema.parse(req.body);

  const ownership = await prismaclient.equipmentOwnership.findUnique({
    where: { id: ownershipId },
  });

  if (!ownership) throw new BadRequestError("Ownership record not found");

  const result = await prismaclient.$transaction(async (tx) => {
    // Update ownership record fields only
    const updated = await tx.equipmentOwnership.update({
      where: { id: ownershipId },
      data: {
        ...validatedData,
        startDate: validatedData.startDate
          ? new Date(validatedData.startDate)
          : ownership.startDate,
        endDate: validatedData.endDate
          ? new Date(validatedData.endDate)
          : ownership.endDate,
      },
    });

    // === DOCUMENT UPDATES (optional) ===
    if (req.files && Object.keys(req.files).length > 0) {
      const uploadedFiles = Object.values(req.files).flat();
      const structuredFiles = getFileUrls(
        uploadedFiles as Express.Multer.File[],
        "ownershipId",
        ownershipId
      );

      for (const file of structuredFiles) {
        // Check if file with same name exists for this ownership
        const existingDoc = await tx.document.findFirst({
          where: { ownershipId, fileName: file.fileName },
        });

        if (existingDoc) {
          // Update the document
          await tx.document.update({
            where: { id: existingDoc.id },
            data: {
              fileUrl: file.fileUrl,
              fileType: file.fileType || "unknown",
              fileSize: file.fileSize || 0,
            },
          });
        } else {
          // Create new document
          await tx.document.create({
            data: {
              ...file,
              ownershipId,
              fileType: file.fileType || "unknown",
              fileSize: file.fileSize || 0,
            },
          });
        }
      }
    }
  });

  res.status(200).json({
    success: true,
    message: "Ownership record updated successfully",
  });
};



