import { Request, Response } from "express";
import { BadRequestError, unAuthorizedError } from "../logger/exceptions";
import { sanitizeInput } from "../utils/helperFunction";
import { operatorSchema } from "../validator/authValidator";
import { getFileUrls } from "../utils/fileHandler";
import { prismaclient } from "../lib/prisma-connect";

// =======================================================
// GET OPERATORS WITH QUERIES AND PAGINATION
// =======================================================
export const getOperators = async (req: Request, res: Response) => {
  const user: any = req.user;
  // if (user.role === "OFFICER") throw new unAuthorizedError(Unauthorized user, please login to continue);//TODO:

  const {
    page = "1",
    limit = "10",
    search,
    rank,
    branch,
    position,
    hasEquipment, // true/false to filter operators with/without current equipment
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
      { firstName: { contains: search as string } },
      { lastName: { contains: search as string } },
      { serviceNumber: { contains: search as string } },
      { email: { contains: search as string } },
      { officialEmailAddress: { contains: search as string } },
    ];
  }

  if (rank) where.rank = rank;
  if (branch) where.branch = branch;
  if (position) where.position = position;

  // Filter by equipment assignment status
  if (hasEquipment === "true") {
    where.ownerships = {
      some: { isCurrent: true },
    };
  } else if (hasEquipment === "false") {
    where.ownerships = {
      none: { isCurrent: true },
    };
  }

  // Build orderBy
  const orderBy: any = {};
  orderBy[sortBy as string] = sortOrder;

  const [operators, total] = await Promise.all([
    prismaclient.operator.findMany({
      where,
      include: {
        ownerships: {
          where: { isCurrent: true },
          select: {
            id: true,
            equipment: {
              select: {
                id: true,
                equipmentName: true,
                chasisNumber: true,
                model: true,
                currentCondition: true,
              },
            },
            startDate: true,
          },
        },
        _count: {
          select: {
            ownerships: true,
            documents: true,
          },
        },
      },
      orderBy,
      skip,
      take: limitNum,
    }),
    prismaclient.operator.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    data: operators,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
};


// =======================================================
// CREATE OPERATOR (WITH IDEMPOTENCY) - FIXED
// =======================================================
export const createOperator = async (req: Request, res: Response) => {
  const user: any = req.user;
  if (user.role === "OFFICER") throw new unAuthorizedError("Unauthorized user");

  const validated = operatorSchema.parse(req.body);
  const idempotencyKey = req.headers["idempotency-key"] as string;

  // Check idempotency
  if (idempotencyKey) {
    const existingOperator = await prismaclient.operator.findFirst({
      where: {
        OR: [
          { serviceNumber: validated.serviceNumber },
          { idempotency_tracker: { some: { key: idempotencyKey } } }, 
        ],
      },
      include: { documents: true },
    });

    if (existingOperator) {
      return res.status(200).json({
        success: true,
        message: "Operator already exists",
        data: existingOperator,
        isNew: false,
      });
    }
  }

  // Check for duplicates
  const existing = await prismaclient.operator.findFirst({
    where: {
      OR: [
        { serviceNumber: validated.serviceNumber },
        { email: validated.email },
      ],
    },
  });

  if (existing) {
    if (existing.serviceNumber === validated.serviceNumber) {
      throw new BadRequestError("Operator with this service number already exists");
    }
    if (existing.email === validated.email) {
      throw new BadRequestError("Operator with this email already exists");
    }
  }

  const result = await prismaclient.$transaction(async (tx) => {
    const operator = await tx.operator.create({
      data: validated,
    });

    if (req.files) {
      let filesToUpload: Express.Multer.File[] = [];

      if (Array.isArray(req.files)) {
        // upload.any() format
        filesToUpload = req.files;
      } else if (typeof req.files === 'object') {
        // upload.fields() format
        filesToUpload = Object.values(req.files).flat();
      }

      if (filesToUpload.length > 0) {
        const structuredFiles = getFileUrls(
          filesToUpload,
          "operatorId",
          operator.id
        );


        await tx.document.createMany({
          data: structuredFiles.map((file) => ({
            fileName: file.fileName,
            fileUrl: file.fileUrl,
            operatorId: operator.id, 
            fileType: file.fileType || "unknown",
            fileSize: file.fileSize || 0,
          })),
        });
      }
    }

    if (idempotencyKey) {
      await tx.idempotency_tracker.create({
        data: {
          key: idempotencyKey,
          operator_id: operator.id, 
        },
      });
    }

    // Return operator with documents
    return await tx.operator.findUnique({
      where: { id: operator.id },
      include: { documents: true },
    });
  });

  res.status(201).json({
    success: true,
    message: "Operator created successfully",
    data: result,
    isNew: true,
  });
};

// =======================================================
// UPDATE OPERATOR 
// =======================================================
export const updateOperator = async (req: Request, res: Response) => {
  const user: any = req.user;

  let { id } = req.params;
  id = sanitizeInput(id);

  const operator = await prismaclient.operator.findUnique({ where: { id } });
  if (!operator) throw new BadRequestError("Operator not found");

  const validated = operatorSchema.parse(req.body);

  // Check if updating to a service number or email that already exists
  if (validated.serviceNumber !== operator.serviceNumber || validated.email !== operator.email) {
    const existing = await prismaclient.operator.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [
              { serviceNumber: validated.serviceNumber },
              { email: validated.email },
            ],
          },
        ],
      },
    });

    if (existing) {
      if (existing.serviceNumber === validated.serviceNumber) {
        throw new BadRequestError("Service number already in use by another operator");
      }
      if (existing.email === validated.email) {
        throw new BadRequestError("Email already in use by another operator");
      }
    }
  }

  const result = await prismaclient.$transaction(async (tx) => {
    // Update operator info
    const updatedOperator = await tx.operator.update({
      where: { id },
      data: validated,
    });

    if (req.files) {
      let filesToUpload: Express.Multer.File[] = [];

      if (Array.isArray(req.files)) {
        filesToUpload = req.files;
      } else if (typeof req.files === 'object') {
        filesToUpload = Object.values(req.files).flat();
      }

      if (filesToUpload.length > 0) {
        const structuredFiles = getFileUrls(
          filesToUpload,
          "operatorId",
          operator.id
        );


        for (const file of structuredFiles) {
          const existing = await tx.document.findFirst({
            where: { 
              operatorId: operator.id, 
              fileName: file.fileName 
            },
          });

          if (existing) {
            // Update existing document
            await tx.document.update({
              where: { id: existing.id },
              data: { 
                fileUrl: file.fileUrl, 
                fileType: file.fileType || "unknown", 
                fileSize: file.fileSize || 0 
              },
            });
          } else {
            // Create new document
            await tx.document.create({
              data: {
                fileName: file.fileName,
                fileUrl: file.fileUrl,
                operatorId: operator.id, 
                fileType: file.fileType || "unknown",
                fileSize: file.fileSize || 0,
              },
            });
          }
        }
      }
    }

    return await tx.operator.findUnique({
      where: { id },
      include: { documents: true },
    });
  });

  res.status(200).json({
    success: true,
    message: "Operator updated successfully",
    data: result,
  });
};

// =======================================================
// GET OPERATOR BY ID - FIXED
// =======================================================
export const getOperatorById = async (req: Request, res: Response) => {
  let { id } = req.params;
  id = sanitizeInput(id);

  const user: any = req.user;

  const operator = await prismaclient.operator.findUnique({
    where: { id },
    include: {
      documents: {
        where: { 
          inspectionItemId: null,
          inspectionId: null,
          equipmentId: null,
          ownershipId: null,
          conditionRecordId: null,
        },
        select: {
          id: true,
          fileName: true,
          fileUrl: true,
          fileType: true,
          fileSize: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      ownerships: {
        include: {
          equipment: {
            select: {
              id: true,
              equipmentName: true,
              chasisNumber: true,
              model: true,
              equipmentType: true,
              currentCondition: true,
            },
          },
          assignedBy: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          documents: {
            select: {
              id: true,
              fileName: true,
              fileUrl: true, 
              fileType: true,
              fileSize: true,
            },
          },
        },
        orderBy: { startDate: "desc" },
      },
      _count: {
        select: {
          ownerships: true,
          documents: true,
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



// =======================================================
// DELETE OPERATOR
// =======================================================
export const deleteOperator = async (req: Request, res: Response) => {
  const user: any = req.user;

  let { id } = req.params;
  id = sanitizeInput(id);

  const operator = await prismaclient.operator.findUnique({
    where: { id },
    include: {
      ownerships: {
        where: { isCurrent: true },
      },
    },
  });

  if (!operator) throw new BadRequestError("Operator not found");

  // Check if operator has current equipment assignments
  if (operator.ownerships.length > 0) {
    throw new BadRequestError(
      "Cannot delete operator with active equipment assignments. Please reassign equipment first."
    );
  }

  await prismaclient.operator.delete({ where: { id } });

  res.status(200).json({
    success: true,
    message: "Operator deleted successfully",
  });
};

// =======================================================
// GET OPERATOR STATISTICS
// =======================================================
export const getOperatorStats = async (req: Request, res: Response) => {
  const user: any = req.user;

  const [
    totalOperators,
    byRank,
    byBranch,
    byPosition,
    operatorsWithEquipment,
    operatorsWithoutEquipment,
  ] = await Promise.all([
    prismaclient.operator.count(),
    prismaclient.operator.groupBy({
      by: ["rank"],
      _count: true,
    }),
    prismaclient.operator.groupBy({
      by: ["branch"],
      _count: true,
      where: { branch: { not: null } },
    }),
    prismaclient.operator.groupBy({
      by: ["position"],
      _count: true,
      where: { position: { not: null } },
    }),
    prismaclient.operator.count({
      where: {
        ownerships: {
          some: { isCurrent: true },
        },
      },
    }),
    prismaclient.operator.count({
      where: {
        ownerships: {
          none: { isCurrent: true },
        },
      },
    }),
  ]);

  res.status(200).json({
    success: true,
    stats: {
      total: totalOperators,
      withEquipment: operatorsWithEquipment,
      withoutEquipment: operatorsWithoutEquipment,
      byRank,
      byBranch,
      byPosition,
    },
  });
};

// =======================================================
// GET OPERATOR EQUIPMENT HISTORY
// =======================================================
export const getOperatorEquipmentHistory = async (req: Request, res: Response) => {
  const user: any = req.user;

  let { id } = req.params;
  id = sanitizeInput(id);

  const operator = await prismaclient.operator.findUnique({ where: { id } });
  if (!operator) throw new BadRequestError("Operator not found");

  const history = await prismaclient.equipmentOwnership.findMany({
    where: { operatorId: id },
    include: {
      equipment: {
        select: {
          id: true,
          equipmentName: true,
          chasisNumber: true,
          model: true,
          equipmentType: true,
          currentCondition: true,
        },
      },
      assignedBy: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      documents: {
        where: { fileType: { not: "idempotency" } },
        select: {
          id: true,
          fileName: true,
          fileUrl: true,
          createdAt: true,
        },
      },
    },
    orderBy: { startDate: "desc" },
  });

  
  res.status(200).json({
    success: true,
    data: history,
  });
};