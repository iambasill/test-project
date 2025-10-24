import { Request, Response } from "express";
import { BadRequestError, notFoundError, unAuthorizedError } from "../httpClass/exceptions";

import { z } from 'zod';
import { CreateInspectionSchema } from "../schema/schema";
import { sanitizeInput } from "../utils/helperFunction";
import { handleFileUploads } from "../utils/filerHandler";
import { prismaclient } from "../lib/prisma-connect";

const prisma = prismaclient

export const createInspection = async (req: Request, res: Response) => {
    const user: any = req.user;
    
    // Parse the JSON string if it exists
    let rawData;
    if (typeof req.body.data === 'string') {
        try {
            rawData = JSON.parse(req.body.data);
        } catch (error) {
            throw new BadRequestError('Invalid JSON data in request body');
        }
    } else {
        rawData = req.body.data || req.body;
    }


    const {
        equipmentId,
        nextDueDate,
        overallNotes,
        overallCondition,
        items
    } = CreateInspectionSchema.parse(rawData);

    // Verify equipment exists
    const equipment = await prisma.equipment.findUnique({
        where: { id: equipmentId },
        select: { id: true } 
    });

    if (!equipment) {
        throw new BadRequestError(`Equipment with ID ${equipmentId} not found`);
    }

        const result = await prisma.$transaction(async (tx) => {
            // Create the main inspection first
            const inspection = await tx.inspection.create({
                data: {
                    equipment: { connect: { id: equipmentId } },
                    inspector: { connect: { id: user.id } },
                    nextDueDate: nextDueDate ? new Date(nextDueDate) : null,
                    overallNotes: overallNotes || null,
                    overallCondition
                }
            });

            // Create inspection items
            if (items.length > 0) {
                const itemsData = items.map(item => ({
                    inspectionId: inspection.id,
                    category: item.category,
                    itemName: item.itemName,
                    itemType: item.itemType,
                    position: item.position || null,
                    condition: item.condition || null,
                    pressure: item.pressure || null,
                    value: item.value || null,
                    booleanValue: item.booleanValue ?? null,
                    unit: item.unit || null,
                    stumpLastDate: item.stumpLastDate ? new Date(item.stumpLastDate) : null,
                    oilfilterLastDate: item.oilfilterLastDate ? new Date(item.oilfilterLastDate) : null,
                    fuelpumpLastDate: item.fuelpumpLastDate ? new Date(item.fuelpumpLastDate) : null,
                    airfilterLastDate: item.airfilterLastDate ? new Date(item.airfilterLastDate) : null,
                    HubLastPackedDate: item.HubLastPackedDate ? new Date(item.HubLastPackedDate) : null,
                    lastDrainDate: item.lastDrainDate ? new Date(item.lastDrainDate) : null,
                    odometerReading: item.odometerReading || null,
                    levelOfHydraulicFluid: item.levelOfHydraulicFluid || null,
                    notes: item.notes || null
                }));

                await tx.inspectionItem.createMany({
                    data: itemsData,
                    skipDuplicates: true
                });
            }

            return inspection;
        });

        // Handle file uploads after main transaction (non-blocking)
        let fileUploadPromise = null;
        if (req.files && Object.keys(req.files).length > 0) {
            fileUploadPromise = handleFileUploads(req.files, result.id);
        }

        // Return response immediately, don't wait for file uploads
        const response = {
            success: true,
            message: 'Inspection created successfully',
            data: {
                id: result.id,
                equipmentId: result.equipmentId,
                datePerformed: result.datePerformed
            }
        };

        // If files are being uploaded, handle them asynchronously
        if (fileUploadPromise) {
            fileUploadPromise.catch(error => {
                console.error('File upload failed:', error);
                // You might want to implement a retry mechanism or notification system here
            });
        }

        return res.status(201).json(response);

};



export const getAllInspections = async (req: Request, res: Response) => {
    const user: any = req.user;


    // Build where clause based on user role and filters
    const where: any = (user.role === "ADMIN" || user.role === "PLATADMIN") 
        ? {} 
        : { inspectorId: user.id };


    // Get total count for pagination
    const totalCount = await prisma.inspection.count({ where });

    // Fetch inspections with optimized includes
    const inspections = await prisma.inspection.findMany({
        where,
        include: {
            items: {
                select: {
                    id: true,
                    category: true,
                    itemName: true,
                    itemType: true,
                    position: true,
                    condition: true,
                    pressure: true,
                    value: true,
                    booleanValue: true,
                    unit: true,
                    odometerReading: true,
                    levelOfHydraulicFluid: true,
                    notes: true
                },
                orderBy: [
                    { category: 'asc' },
                    { itemName: 'asc' }
                ]
            },
            documents: {
                select: {
                    id: true,
                    fileName: true,
                    fileUrl: true,
                    fileSize: true,
                    fileType: true
                }
            },
            equipment: {
                select: { 
                    id: true,
                    chasisNumber: true, 
                    equipmentName: true, 
                    model: true 
                }
            },
            inspector: {
                select: { 
                    id: true, 
                    firstName: true, 
                    lastName: true, 
                    serviceNumber: true, 
                    email: true 
                }
            }
        },
        orderBy: { datePerformed: 'desc' },

    });

    res.status(200).json({
        success: true,
        data: inspections,
        total: totalCount,
        });
    };

// Get inspections by equipment ID
export const getInspectionById = async (req: Request, res: Response) => {
    const user: any = req.user;

    let { id } = req.params;
    if (!id ) {
        throw new BadRequestError('Invalid or missing ID');
    }
     id  = sanitizeInput(id)

    // Build where clause based on user role
    const where = (user.role === "ADMIN" || user.role === "PLATADMIN" || user.role === "AUDITOR") 
        ? { equipmentId: id } 
        : { inspectorId: user.id, equipmentId: id };

    const inspections = await prisma.inspection.findMany({
        where,
        include: {
            items: {
                select: {
                    id: true,
                    category: true,
                    itemName: true,
                    itemType: true,
                    position: true,
                    condition: true,
                    pressure: true,
                    value: true,
                    booleanValue: true,
                    unit: true,
                    stumpLastDate: true,
                    oilfilterLastDate: true,
                    fuelpumpLastDate: true,
                    airfilterLastDate: true,
                    HubLastPackedDate: true,
                    lastDrainDate: true,
                    odometerReading: true,
                    levelOfHydraulicFluid: true,
                    notes: true
                },
                orderBy: [
                    { category: 'asc' },
                    { itemName: 'asc' }
                ]
            },
            documents: {
                select: {
                    id: true,
                    fileName: true,
                    fileUrl: true,
                    fileSize: true,
                    fileType: true
                }
            },
            equipment: {
                select: { 
                    id: true,
                    chasisNumber: true, 
                    equipmentName: true, 
                    model: true 
                }
            },
            inspector: {
                select: { 
                    id: true, 
                    firstName: true, 
                    lastName: true, 
                    serviceNumber: true, 
                    email: true 
                }
            }
        },
        orderBy: { datePerformed: 'desc' }
    });

    if (!inspections || inspections.length === 0) {
        throw new notFoundError('No inspections found for this equipment');
    }

    res.status(200).json({
        success: true,
        data: inspections
    });
};

// Delete inspection
export const deleteInspection = async (req: Request, res: Response) => {

    
    let { id } = req.params;
    if (!id )  throw new BadRequestError('Invalid or missing ID');
    
     id  = sanitizeInput(id)
        await prisma.$transaction(async (tx) => {
            // Check if inspection exists
            const inspection = await tx.inspection.findUnique({
                where: { id },
                select: { id: true }
            });

            if (!inspection) {
                throw new BadRequestError('Inspection not found');
            }

            // Delete all related inspection items (cascade should handle this, but explicit for safety)
            await tx.inspectionItem.deleteMany({ 
                where: { inspectionId: id } 
            });

            // Delete related documents
            await tx.document.deleteMany({ 
                where: { inspectionId: id } 
            });

            // Finally delete the main inspection
            await tx.inspection.delete({
                where: { id }
            });
        });

        res.status(200).json({
            success: true,
            message: 'Inspection and all related data deleted successfully'
        });

}

