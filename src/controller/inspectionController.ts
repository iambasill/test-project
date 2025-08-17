import { Request, Response } from "express";
import { prisma } from "../server";
import { BadRequestError, unAuthorizedError } from "../httpClass/exceptions";

// Create a new inspection
export const createInspection = async (req: Request, res: Response) => {
    const user: any = req.user;
    
    if (!req.body) {
        throw new BadRequestError('Request body is missing');
    }

    // Debug: Log the raw request body
    console.log('Raw request body:', req.body);

    // Parse the JSON string if it exists
    let inspectionData;
    if (typeof req.body.data === 'string') {
        try {
            inspectionData = JSON.parse(req.body.data);
        } catch (error) {
            throw new BadRequestError('Invalid JSON data in request body');
        }
    } else {
        inspectionData = req.body.data || {};
    }


    // Destructure from the parsed data
    const equipmentId = "a2475249-a705-48d6-9092-c3071159211e";
    const {
        nextDueDate,
        overallNotes = null,
        exteriorInspections = [],
        interiorInspections = [],
        mechanicalInspections = [],
        functionalInspections = [],
        documentLegalInspections = []
    } = inspectionData; 
    // Verify equipment exists
    const equipment = await prisma.equipment.findUnique({
        where: { id: equipmentId }
    });

    if (!equipment) {
        throw new BadRequestError(`Equipment with ID ${equipmentId} not found`);
    }

    // Create inspection with all relations
    try {
        const inspection = await prisma.inspection.create({
            data: {
                equipment: { connect: { id: equipmentId } },
                inspector: { connect: { id: user.id } },
                nextDueDate: nextDueDate ? new Date(nextDueDate) : null,
                overallNotes,
                exteriorInspections: {
                    create: validateInspectionItems(exteriorInspections)
                },
                interiorInspections: {
                    create: validateInspectionItems(interiorInspections)
                },
                mechanicalInspections: {
                    create: validateInspectionItems(mechanicalInspections)
                },
                functionalInspections: {
                    create: validateInspectionItems(functionalInspections)
                },
                documentLegalInspections: {
                    create: validateInspectionItems(documentLegalInspections)
                }
            },
            include: {
                exteriorInspections: true,
                interiorInspections: true,
                mechanicalInspections: true,
                functionalInspections: true,
                documentLegalInspections: true
            }
        });

        // Handle file uploads if present
        if (req.files) {
            await handleFileUploads(req.files, inspection.id);
        }

        return res.status(201).json({
            success: true,
            data: inspection
        });

    } catch (error) {
        console.error('Inspection creation failed:', error);
        throw new Error('Failed to create inspection');
    }
};

// Helper function to validate inspection items
function validateInspectionItems(items: any[]) {
    if (!Array.isArray(items)) return [];
    
    return items.map(item => ({
        itemName: item.itemName || 'Unspecified',
        condition: item.condition || 'NOT_APPLICABLE',
        notes: item.notes || null
    }));
}

// Helper function to handle file uploads
async function handleFileUploads(files: any, inspectionId: string) {
    const fileEntries = Object.entries(files);
    if (fileEntries.length === 0) return;

    const fileData = fileEntries.map(([fieldName, fileArray]) => {
        const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;
        return {
            fileName: fieldName,
            url: file.path,
            inspectionId,
            fileSize: file.size,
            mimeType: file.mimetype
        };
    });

    await prisma.document.createMany({
        data: fileData
    });
}

// Get all inspections
export const getAllInspections = async (req: Request, res: Response) => {
    const user: any = req.user

    // Fixed: Logical operator issue - this was always evaluating to empty object
    const where = (user.role === "ADMIN" || user.role === "PLATADMIN") ? {} : { inspectorId: user.id }

    const inspections = await prisma.inspection.findMany({
        where,
        include: {
            exteriorInspections: true,
            interiorInspections: true,
            mechanicalInspections: true,
            functionalInspections: true,
            documentLegalInspections: true,
            documents: true,
            equipment: {
                select: { chasisNumber: true, equipmentName: true, model: true }
            },
            inspector: {
                select: { id: true, firstName: true, lastName: true, serviceNumber: true, email: true }
            }
        },
        orderBy: { datePerformed: 'desc' }
    });

    res.status(200).json({
        success: true,
        data: inspections,
    });
};

// Get single inspection by ID
export const getInspectionById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const inspection = await prisma.inspection.findMany({
        where: { equipmentId: id },
        include: {
            exteriorInspections: true,
            interiorInspections: true,
            mechanicalInspections: true,
            functionalInspections: true,
            documentLegalInspections: true,
            documents: true,
            equipment: {
                select: { chasisNumber: true, equipmentName: true, model: true }
            },
            inspector: {
                select: { id: true, firstName: true, lastName: true, serviceNumber: true, email: true }
            }
        },
        orderBy: { datePerformed: 'desc' }

    });

    if (!inspection || inspection.length === 0) throw new BadRequestError('Inspection not found')

    res.status(200).json({
        success: true,
        data: inspection
    });
};



// Delete inspection
export const deleteInspection = async (req: Request, res: Response) => {
    const { id } = req.params;

    await prisma.inspection.delete({
        where: { id }
    });

    res.json({
        success: true,
        message: 'Inspection deleted successfully'
    });
};