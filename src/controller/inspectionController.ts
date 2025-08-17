import { Request, Response } from "express";
import { prisma } from "../server";
import { BadRequestError, unAuthorizedError } from "../httpClass/exceptions";
import { inspectionData } from "../schema/schema";

// Create a new inspection
export const createInspection = async (req: Request, res: Response) => {
    console.log('=== DEBUG INFO ===');
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Raw req.body:', req.body);
    console.log('Has files:', !!req.files);
    console.log('Files:', req.files);
    console.log('==================');

    const user: any = req.user;
    
    if (!req.body) {
        throw new BadRequestError('Request body is missing. Make sure your middleware is properly configured for multipart/form-data.');
    }

    const {
        equipmentId,
        nextDueDate,
        overallNotes,
        exteriorInspections: exteriorInspectionsRaw,
        interiorInspections: interiorInspectionsRaw,
        mechanicalInspections: mechanicalInspectionsRaw,
        functionalInspections: functionalInspectionsRaw,
        documentLegalInspections: documentLegalInspectionsRaw
    } = req.body;

    // Parse the JSON strings back to arrays with error handling
    const safeParseJSON = (jsonString: any): any[] => {
        if (!jsonString) return [];
        if (Array.isArray(jsonString)) return jsonString;
        
        try {
            const parsed = JSON.parse(jsonString);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error('Failed to parse JSON:', error);
            return [];
        }
    };

    const exteriorInspections = safeParseJSON(exteriorInspectionsRaw);
    const interiorInspections = safeParseJSON(interiorInspectionsRaw);
    const mechanicalInspections = safeParseJSON(mechanicalInspectionsRaw);
    const functionalInspections = safeParseJSON(functionalInspectionsRaw);
    const documentLegalInspections = safeParseJSON(documentLegalInspectionsRaw);

    const equipment = await prisma.equipment.findFirst({
        where: { id: equipmentId }
    });

    if (!equipment) {
        throw new Error(`Equipment with ID ${equipmentId} not found`);
    }

    const inspection = await prisma.inspection.create({
        data: {
            equipment: {
                connect: { id: "a2475249-a705-48d6-9092-c3071159211e" } 
            },
            inspector: {
                connect: { id: user.id }
            },
            nextDueDate: nextDueDate ? new Date(nextDueDate) : null,
            overallNotes,
            exteriorInspections: {
                create: exteriorInspections.map((item: any) => ({
                    itemName: item.itemName,
                    condition: item.condition,
                    notes: item.notes
                }))
            },
            interiorInspections: {
                create: interiorInspections.map((item: any) => ({
                    itemName: item.itemName,
                    condition: item.condition,
                    notes: item.notes
                }))
            },
            mechanicalInspections: {
                create: mechanicalInspections.map((item: any) => ({
                    itemName: item.itemName,
                    condition: item.condition,
                    notes: item.notes
                }))
            },
            functionalInspections: {
                create: functionalInspections.map((item: any) => ({
                    itemName: item.itemName,
                    condition: item.condition,
                    notes: item.notes
                }))
            },
            documentLegalInspections: {
                create: documentLegalInspections.map((item: any) => ({
                    itemName: item.itemName,
                    condition: item.condition,
                    notes: item.notes
                }))
            }
        },
    });

    // Handle document uploads if files exist
    if (req.files) {
        const files = req.files as Record<string, Express.Multer.File[]>;
        
        // Fixed: Check if files is actually an object with entries
        if (files && typeof files === 'object') {
            const fileEntries = Object.entries(files);
            if (fileEntries.length > 0) {
                const fileData = fileEntries
                    .filter(([fileName, fileArray]) => fileArray && fileArray.length > 0)
                    .map(([fileName, fileArray]) => ({
                        fileName,
                        url: fileArray[0].path.toString(),
                        inspectionId: inspection.id
                    }));
                
                console.log("fileData:", fileData);

                // Uncomment when ready to save documents
                if (fileData.length > 0) {
                    // await prisma.document.createMany({
                    //     data: fileData
                    // });
                }
            }
        }
    }

    // Send response only once at the end
    res.status(201).json({
        success: true,
        message: 'Inspection created successfully',
        data: inspection
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
            equipment: true,
            inspector: {
                select: { id: true, firstName: true, lastName: true, serviceNumber: true, email: true }
            }
        }
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