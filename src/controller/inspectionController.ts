import { Request, Response } from "express";
import { BadRequestError, notFoundError } from "../logger/exceptions";
import { CreateInspectionSchema } from "../validator/authValidator";
import { prismaclient } from "../lib/prisma-connect";
import { handleFileUploads } from "../utils/helperFunction";
import { User } from "../generated/prisma";

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

  // Create inspection and items
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
    const createdItems = [];
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

  // Handle file uploads (non-blocking)
  const fileUploadPromises: Promise<void>[] = [];

  if (req.files && Object.keys(req.files).length > 0) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Handle inspection-level images
    if (files["inspectionImages"]) {
      fileUploadPromises.push(
        handleFileUploads(
          { inspectionImages: files["inspectionImages"] },
          result.inspection.id,
          "inspectionId"
        )
      );
    }

    // Handle item-level images (item_0_images, item_1_images, etc.)
    result.createdItems.forEach((item, index) => {
      const itemImageKey = `item_${index}_images`;
      if (files[itemImageKey]) {
        fileUploadPromises.push(
          handleFileUploads(
            { [itemImageKey]: files[itemImageKey] },
            item.id,
            "inspectionItemId"
          )
        );
      }
    });

    // Execute all uploads in background
    Promise.all(fileUploadPromises).catch((error) => {
      console.error("File upload failed:", error);
    });
  }

  // Respond immediately
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