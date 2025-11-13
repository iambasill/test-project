import { Request, Response } from "express";
import { BadRequestError, notFoundError } from "../logger/exceptions";
import { CreateInspectionSchema } from "../validator/authValidator";
import { prismaclient } from "../lib/prisma-connect";
import {  sanitizeInput } from "../utils/helperFunction";
import { User, InspectionItem } from "../generated/prisma";
import { getFileUrls } from "../utils/fileHandler";

/**
 * Create an inspection (with idempotency)
 */
export const createInspection = async (req: Request, res: Response) => {
  const user = req.user as User;
  const idempotencyKey = req.headers["idempotency-key"] as string;

  // Parse JSON string if exists
  let rawData;
  if (typeof req.body.data === "string") {
    try {
      rawData = JSON.parse(req.body.data);
    } catch (error) {
      throw new BadRequestError("Invalid JSON data in request body");
    }
  } else {
    rawData = req.body.data || req.body;
  }

  const { equipmentId, nextDueDate, overallNotes, overallCondition, items } =
    CreateInspectionSchema.parse(rawData);

  // Check idempotency
  if (idempotencyKey) {
    const existingInspection = await prismaclient.inspection.findFirst({
      where: {
        equipmentId,
        idempotency_tracker: { some: { key: idempotencyKey } },
      },
      select: {
        id: true,
        equipmentId: true,
        datePerformed: true,
      },
    });

    if (existingInspection) {
      return res.status(200).json({
        success: true,
        message: "Inspection created successfully (idempotent)",
        data: {
          id: existingInspection.id,
          equipmentId: existingInspection.equipmentId,
          datePerformed: existingInspection.datePerformed,
        },
      });
    }
  }

  // Verify equipment exists
  const equipment = await prismaclient.equipment.findUnique({
    where: { id: equipmentId },
    select: { id: true },
  });

  if (!equipment) {
    throw new BadRequestError(`Equipment not found!`);
  }

  // Create inspection and items with file uploads in transaction
  const result = await prismaclient.$transaction(async (tx) => {
    const inspection = await tx.inspection.create({
      data: {
        equipment: { connect: { id: equipmentId } },
        inspector: { connect: { id: user.id } },
        nextDueDate: nextDueDate ? new Date(nextDueDate) : null,
        overallNotes: overallNotes || null,
        overallCondition,
      },
    });

    // Create inspection items if available
    const createdItems: InspectionItem[] = [];
    if (items && items.length > 0) {
      for (const item of items) {
        const createdItem = await tx.inspectionItem.create({
          data: {
            inspectionId: inspection.id,
            category: item.category,
            itemName: item.itemName,
            method: item.method,
            position: item.position || null,
            condition: item.condition || null,
            pressure: item.pressure || null,
            value: item.value || null,
            booleanValue: item.booleanValue ?? null,
            unit: item.unit || null,
            stumpLastDate: item.stumpLastDate
              ? new Date(item.stumpLastDate)
              : null,
            oilfilterLastDate: item.oilfilterLastDate
              ? new Date(item.oilfilterLastDate)
              : null,
            fuelpumpLastDate: item.fuelpumpLastDate
              ? new Date(item.fuelpumpLastDate)
              : null,
            airfilterLastDate: item.airfilterLastDate
              ? new Date(item.airfilterLastDate)
              : null,
            HubLastPackedDate: item.HubLastPackedDate
              ? new Date(item.HubLastPackedDate)
              : null,
            lastDrainDate: item.lastDrainDate ? new Date(item.lastDrainDate) : null,
            odometerReading: item.odometerReading || null,
            levelOfHydraulicFluid: item.levelOfHydraulicFluid || null,
            notes: item.notes || null,
          },
        });
        createdItems.push(createdItem);
      }
    }

    // Handle file uploads (if any)
    if (req.files && Object.keys(req.files).length > 0) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      // Handle inspection-level images
      if (files["inspectionImages"]) {
        const uploadedFiles = files["inspectionImages"];
        const structuredFiles = getFileUrls(
          uploadedFiles,
          "inspectionId",
          inspection.id
        );

        await tx.document.createMany({
          data: structuredFiles.map((file) => ({
            fileName: file.fileName,
            fileUrl: file.fileUrl,
            inspectionId: inspection.id,
            fileType: file.fileType || "unknown",
            fileSize: file.fileSize || 0,
          })),
        });
      }

      // Handle item-level images (item_0_images, item_1_images, etc.)
      for (let index = 0; index < createdItems.length; index++) {
        const itemImageKey = `item_${index}_images`;
        if (files[itemImageKey]) {
          const uploadedFiles = files[itemImageKey];
          const structuredFiles = getFileUrls(
            uploadedFiles,
            "inspectionItemId",
            createdItems[index].id
          );

          await tx.document.createMany({
            data: structuredFiles.map((file) => ({
              fileName: file.fileName,
              fileUrl: file.fileUrl,
              inspectionItemId: createdItems[index].id,
              fileType: file.fileType || "unknown",
              fileSize: file.fileSize || 0,
            })),
          });
        }
      }
    }

    // Create idempotency tracker if key provided
    if (idempotencyKey) {
      await tx.idempotency_tracker.create({
        data: {
          key: idempotencyKey,
          inspection_id: inspection.id,
        },
      });
    }

    return { inspection, createdItems };
  });

  // Respond after transaction completes
  return res.status(201).json({
    success: true,
    message: "Inspection created successfully",
    data: {
      id: result.inspection.id,
      equipmentId: result.inspection.equipmentId,
      datePerformed: result.inspection.datePerformed,
      itemsCreated: result.createdItems.length,
    },
  });
};

export const getAllInspectionByEquipmentId = async (req: Request, res: Response) => {
  const equipmentId  = sanitizeInput(req.params.id)

 // Extract pagination and filter parameters from query
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const sortBy = (req.query.sortBy as string) || 'createdAt';
  const sortOrder = (req.query.sortOrder as string) || 'desc';
  const condition = req.query.condition as string; // Filter by overallCondition: 'S' or 'B'
  const startDate = req.query.startDate as string; // Filter by date range
  const endDate = req.query.endDate as string;
  
    // Build where clause with filters
    const whereClause: any = { equipmentId };
    
    // Add condition filter if provided
    if (condition && (condition === 'S' || condition === 'B')) {
      whereClause.overallCondition = condition;
    }
    
    // Add date range filter if provided
    if (startDate || endDate) {
      whereClause.datePerformed = {};
      if (startDate) {
        whereClause.datePerformed.gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.datePerformed.lte = new Date(endDate);
      }
    }
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    // Get total count for pagination metadata
    const totalCount = await prismaclient.inspection.count({
      where: whereClause,
    });
    
    // Get paginated inspections
    const inspections = await prismaclient.inspection.findMany({
      where: whereClause,
      include: {
        equipment: {
          select: {
            id: true,
            equipmentName: true,
            equipmentType: true,
            chasisNumber: true,
            manufacturer: true,
            model: true,
            yearOfManufacture: true,
            currentCondition: true,
          },
        },
        inspector: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        documents: {
          select:{
          fileName:true,          
          fileType:true,  
          fileSize:true,          
          fileUrl :true           
          }
        },
        items: {
          include: {
            documents: {
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });
    
    // Handle not found
    if (!inspections || inspections.length === 0) {
      throw new notFoundError("No inspections found for this equipment");
    }
    
    // Clean null fields in each inspection and its items
    const cleanedInspections = inspections.map((inspection) => {
      const cleanedItems = inspection.items.map((item) => {
        const cleanedItem: any = {};
        for (const [key, value] of Object.entries(item)) {
          if (value !== null) cleanedItem[key] = value;
        }
        return cleanedItem;
      });
      return {
        ...inspection,
        items: cleanedItems,
      };
    });
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);

    
        // Send response with pagination metadata
        return res.status(200).json({
          success: true,
          message: "Inspections retrieved successfully",
          data: cleanedInspections,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            limit,
          },
        });
  
    };
