import { Request, Response } from "express";
import { prisma } from "../server";
import { BadRequestError, unAuthorizedError } from "../httpClass/exceptions";
import { API_BASE_URL } from "../../secrets";

// Create a new inspection (optimized for performance)
export const createInspection = async (req: Request, res: Response) => {
    const user: any = req.user;
    
    if (!req.body) {
        throw new BadRequestError('Request body is missing');
    }

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
    // const equipmentId = "a2475249-a705-48d6-9092-c3071159211e";
    const {
        equipmentId,
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
        where: { id: equipmentId },
        select: { id: true } // Only select what we need
    });

    if (!equipment) {
        throw new BadRequestError(`Equipment with ID ${equipmentId} not found`);
    }

    try {
        // Use transaction for better performance and data integrity
        const result = await prisma.$transaction(async (tx) => {
            // Create the main inspection first
            const inspection = await tx.inspection.create({
                data: {
                    equipment: { connect: { id: equipmentId } },
                    inspector: { connect: { id: user.id } },
                    nextDueDate: nextDueDate ? new Date(nextDueDate) : null,
                    overallNotes,
                }
            });

            // Prepare all inspection items for batch creation
            const inspectionPromises = [];

            // Create exterior inspections if any
            if (exteriorInspections.length > 0) {
                inspectionPromises.push(
                    tx.exteriorInspection.createMany({
                        data: validateInspectionItems(exteriorInspections).map(item => ({
                            ...item,
                            inspectionId: inspection.id
                        })),
                        skipDuplicates: true
                    })
                );
            }

            // Create interior inspections if any
            if (interiorInspections.length > 0) {
                inspectionPromises.push(
                    tx.interiorInspection.createMany({
                        data: validateInspectionItems(interiorInspections).map(item => ({
                            ...item,
                            inspectionId: inspection.id
                        })),
                        skipDuplicates: true
                    })
                );
            }

            // Create mechanical inspections if any
            if (mechanicalInspections.length > 0) {
                inspectionPromises.push(
                    tx.mechanicalInspection.createMany({
                        data: validateInspectionItems(mechanicalInspections).map(item => ({
                            ...item,
                            inspectionId: inspection.id
                        })),
                        skipDuplicates: true
                    })
                );
            }

            // Create functional inspections if any
            if (functionalInspections.length > 0) {
                inspectionPromises.push(
                    tx.functionalInspection.createMany({
                        data: validateInspectionItems(functionalInspections).map(item => ({
                            ...item,
                            inspectionId: inspection.id
                        })),
                        skipDuplicates: true
                    })
                );
            }

            // Create document/legal inspections if any
            if (documentLegalInspections.length > 0) {
                inspectionPromises.push(
                    tx.documentLegalInspection.createMany({
                        data: validateInspectionItems(documentLegalInspections).map(item => ({
                            ...item,
                            inspectionId: inspection.id
                        })),
                        skipDuplicates: true
                    })
                );
            }

            // Execute all inspection creations in parallel
            await Promise.all(inspectionPromises);

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
            data: {
                id: result.id,
                equipmentId,
                inspectorId: user.id,
                datePerformed: result.datePerformed,
                nextDueDate: result.nextDueDate,
                overallNotes: result.overallNotes,
                message: 'Inspection created successfully'
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

    } catch (error) {
        console.error('Inspection creation failed:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to create inspection: ${error.message}`);
        }
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

// Optimized helper function to handle file uploads
async function handleFileUploads(files: any, inspectionId: string) {
    try {
        if (!files || Object.keys(files).length === 0) return;

        const fileEntries = Object.entries(files);
        const fileData = fileEntries.map(([fileName, fileArray]) => {
            const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;
            return {
                fileName,
                url: `${API_BASE_URL}/attachment/${file.filename}`,
                inspectionId,
                fileSize: file.size,
                mimeType: file.mimetype,
            };
        });

        await prisma.document.createMany({
            data: fileData,
            skipDuplicates: true
        });

        console.log(`Successfully uploaded ${fileData.length} files for inspection ${inspectionId}`);
    } catch (error) {
        console.error('File upload error:', error);
        throw error;
    }
}

// Get all inspections (optimized with pagination)
export const getAllInspections = async (req: Request, res: Response) => {
    const user: any = req.user;
    
    // Extract pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build where clause based on user role
    const where = (user.role === "ADMIN" || user.role === "PLATADMIN") 
        ? {} 
        : { inspectorId: user.id };

    try {
        // Get total count for pagination
        const totalCount = await prisma.inspection.count({ where });

        // Fetch inspections with optimized includes
        const inspections = await prisma.inspection.findMany({
            where,
            include: {
                exteriorInspections: {
                    select: {
                        id: true,
                        itemName: true,
                        condition: true,
                        notes: true
                    }
                },
                interiorInspections: {
                    select: {
                        id: true,
                        itemName: true,
                        condition: true,
                        notes: true
                    }
                },
                mechanicalInspections: {
                    select: {
                        id: true,
                        itemName: true,
                        condition: true,
                        notes: true
                    }
                },
                functionalInspections: {
                    select: {
                        id: true,
                        itemName: true,
                        condition: true,
                        notes: true
                    }
                },
                documentLegalInspections: {
                    select: {
                        id: true,
                        itemName: true,
                        condition: true,
                        notes: true
                    }
                },
                documents: {
                    select: {
                        id: true,
                        fileName: true,
                        url: true,
                        fileSize: true,
                        mimeType: true
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
            skip,
            take: limit
        });

        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            success: true,
            data: inspections,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching inspections:', error);
        throw new Error('Failed to fetch inspections');
    }
};

// Get single inspection by equipment ID (optimized)
export const getInspectionById = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    try {
        const inspections = await prisma.inspection.findMany({
            where: { equipmentId: id },
            include: {
                exteriorInspections: {
                    select: {
                        id: true,
                        itemName: true,
                        condition: true,
                        notes: true
                    }
                },
                interiorInspections: {
                    select: {
                        id: true,
                        itemName: true,
                        condition: true,
                        notes: true
                    }
                },
                mechanicalInspections: {
                    select: {
                        id: true,
                        itemName: true,
                        condition: true,
                        notes: true
                    }
                },
                functionalInspections: {
                    select: {
                        id: true,
                        itemName: true,
                        condition: true,
                        notes: true
                    }
                },
                documentLegalInspections: {
                    select: {
                        id: true,
                        itemName: true,
                        condition: true,
                        notes: true
                    }
                },
                documents: {
                    select: {
                        id: true,
                        fileName: true,
                        url: true,
                        fileSize: true,
                        mimeType: true
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
            throw new BadRequestError('No inspections found for this equipment');
        }

        res.status(200).json({
            success: true,
            data: inspections
        });
    } catch (error) {
        if (error instanceof BadRequestError) {
            throw error;
        }
        console.error('Error fetching inspection:', error);
        throw new Error('Failed to fetch inspection');
    }
};

// Delete inspection (optimized with cascade handling)
export const deleteInspection = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Use transaction to ensure all related data is deleted properly
        await prisma.$transaction(async (tx) => {
            // Check if inspection exists
            const inspection = await tx.inspection.findUnique({
                where: { id },
                select: { id: true }
            });

            if (!inspection) {
                throw new BadRequestError('Inspection not found');
            }

            // Delete all related inspection items first (if not handled by cascade)
            await Promise.all([
                tx.exteriorInspection.deleteMany({ where: { inspectionId: id } }),
                tx.interiorInspection.deleteMany({ where: { inspectionId: id } }),
                tx.mechanicalInspection.deleteMany({ where: { inspectionId: id } }),
                tx.functionalInspection.deleteMany({ where: { inspectionId: id } }),
                tx.documentLegalInspection.deleteMany({ where: { inspectionId: id } }),
                tx.document.deleteMany({ where: { inspectionId: id } })
            ]);

            // Finally delete the main inspection
            await tx.inspection.delete({
                where: { id }
            });
        });

        res.json({
            success: true,
            message: 'Inspection and all related data deleted successfully'
        });
    } catch (error) {
        if (error instanceof BadRequestError) {
            throw error;
        }
        console.error('Error deleting inspection:', error);
        throw new Error('Failed to delete inspection');
    }
};

// New endpoint: Get inspection summary (lightweight)
export const getInspectionSummary = async (req: Request, res: Response) => {
    const user: any = req.user;
    
    const where = (user.role === "ADMIN" || user.role === "PLATADMIN") 
        ? {} 
        : { inspectorId: user.id };

    try {
        const summary = await prisma.inspection.findMany({
            where,
            select: {
                id: true,
                datePerformed: true,
                nextDueDate: true,
                overallNotes: true,
                equipment: {
                    select: {
                        id: true,
                        equipmentName: true,
                        chasisNumber: true,
                        model: true
                    }
                },
                inspector: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        serviceNumber: true
                    }
                },
                _count: {
                    select: {
                        exteriorInspections: true,
                        interiorInspections: true,
                        mechanicalInspections: true,
                        functionalInspections: true,
                        documentLegalInspections: true,
                        documents: true
                    }
                }
            },
            orderBy: { datePerformed: 'desc' }
        });

        res.status(200).json({
            success: true,
            data: summary
        });
    } catch (error) {
        console.error('Error fetching inspection summary:', error);
        throw new Error('Failed to fetch inspection summary');
    }
};