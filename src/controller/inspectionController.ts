import { Request, Response } from "express";
import { prisma } from "../server";
import { BadRequestError, unAuthorizedError } from "../httpClass/exceptions";
import { inspectionData } from "../schema/schema";

// Helper function to parse form data
const parseFormData = (body: any) => {
    if (!body) {
        return {
            equipmentId: undefined,
            nextDueDate: undefined,
            overallNotes: undefined,
            exteriorInspections: [],
            interiorInspections: [],
            mechanicalInspections: [],
            functionalInspections: [],
            documentLegalInspections: []
        };
    }

    const parseIfString = (value: any) => {
        if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        }
        return value;
    };

    return {
        equipmentId: body.equipmentId,
        nextDueDate: body.nextDueDate,
        overallNotes: body.overallNotes,
        exteriorInspections: parseIfString(body.exteriorInspections) || [],
        interiorInspections: parseIfString(body.interiorInspections) || [],
        mechanicalInspections: parseIfString(body.mechanicalInspections) || [],
        functionalInspections: parseIfString(body.functionalInspections) || [],
        documentLegalInspections: parseIfString(body.documentLegalInspections) || []
    };
};

// Helper function to process files and create documents
const processDocumentsForInspectionItems = async (
    inspectionItems: any[], 
    files: any[], 
    categoryPrefix: string,
    inspectionId: string
) => {
    const processedItems = [];
    
    for (let index = 0; index < inspectionItems.length; index++) {
        const item = inspectionItems[index];
        
        // Find files that match this inspection item
        const itemFiles = files.filter(file => 
            file.fieldname && file.fieldname.startsWith(`${categoryPrefix}_${index}_`)
        );

        // Create documents for this inspection item
        const documents = [];
        for (const file of itemFiles) {
            const document = await prisma.document.create({
                data: {
                    url: file.path,
                    fileName: file.originalname || file.filename,
                    fileSize: file.size,
                    mimeType: file.mimetype,
                    description: `${categoryPrefix} inspection image for ${item.itemName}`,
                    metadata: {
                        fieldName: file.fieldname,
                        inspectionCategory: categoryPrefix,
                        inspectionItemIndex: index,
                        itemName: item.itemName
                    },
                    inspectionId: inspectionId
                }
            });
            documents.push(document);
        }

        processedItems.push({
            ...item,
            documents: documents
        });
    }
    
    return processedItems;
};

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
        exteriorInspections,
        interiorInspections,
        mechanicalInspections,
        functionalInspections,
        documentLegalInspections
    } = parseFormData(req.body);

    console.log('Parsed equipmentId:', equipmentId, typeof equipmentId);

    if (!equipmentId) {
        throw new BadRequestError('equipmentId is required');
    }

    // Try to find equipment by id first, then by chasisNumber
    let equipment = await prisma.equipment.findUnique({
        where: { id: equipmentId }
    }).catch(() => null);

    if (!equipment) {
        equipment = await prisma.equipment.findUnique({
            where: { chasisNumber: equipmentId }
        }).catch(() => null);
    }

    if (!equipment) {
        throw new Error(`Equipment with ID/Chassis Number ${equipmentId} not found`);
    }

    // Create the main inspection first
    const inspection = await prisma.inspection.create({
        data: {
            equipmentId: equipment.id,
            inspectorId: user.id,
            nextDueDate: nextDueDate ? new Date(nextDueDate) : null,
            overallNotes
        },
    });

    // Process files (convert to array if it's an object)
    const filesArray = Array.isArray(req.files) ? req.files : 
                      req.files ? Object.values(req.files).flat() : [];

    // Process each category and create inspection items with their documents
    const [
        processedExteriorInspections,
        processedInteriorInspections,
        processedMechanicalInspections,
        processedFunctionalInspections,
        processedDocumentLegalInspections
    ] = await Promise.all([
        processDocumentsForInspectionItems(exteriorInspections, filesArray, 'exterior', inspection.id),
        processDocumentsForInspectionItems(interiorInspections, filesArray, 'interior', inspection.id),
        processDocumentsForInspectionItems(mechanicalInspections, filesArray, 'mechanical', inspection.id),
        processDocumentsForInspectionItems(functionalInspections, filesArray, 'functional', inspection.id),
        processDocumentsForInspectionItems(documentLegalInspections, filesArray, 'documentation', inspection.id)
    ]);

    // Create inspection items and link documents
    const createdExteriorInspections = [];
    for (const item of processedExteriorInspections) {
        const exteriorInspection = await prisma.exteriorInspection.create({
            data: {
                inspectionId: inspection.id,
                itemName: item.itemName,
                condition: item.condition,
                notes: item.notes
            }
        });

        // Link documents to this specific inspection item
        if (item.documents.length > 0) {
            await prisma.document.updateMany({
                where: { id: { in: item.documents.map(d => d.id) } },
                data: { exteriorInspectionId: exteriorInspection.id }
            });
        }

        createdExteriorInspections.push(exteriorInspection);
    }

    // Repeat for other categories
    const createdInteriorInspections = [];
    for (const item of processedInteriorInspections) {
        const interiorInspection = await prisma.interiorInspection.create({
            data: {
                inspectionId: inspection.id,
                itemName: item.itemName,
                condition: item.condition,
                notes: item.notes
            }
        });

        if (item.documents.length > 0) {
            await prisma.document.updateMany({
                where: { id: { in: item.documents.map(d => d.id) } },
                data: { interiorInspectionId: interiorInspection.id }
            });
        }

        createdInteriorInspections.push(interiorInspection);
    }

    const createdMechanicalInspections = [];
    for (const item of processedMechanicalInspections) {
        const mechanicalInspection = await prisma.mechanicalInspection.create({
            data: {
                inspectionId: inspection.id,
                itemName: item.itemName,
                condition: item.condition,
                notes: item.notes
            }
        });

        if (item.documents.length > 0) {
            await prisma.document.updateMany({
                where: { id: { in: item.documents.map(d => d.id) } },
                data: { mechanicalInspectionId: mechanicalInspection.id }
            });
        }

        createdMechanicalInspections.push(mechanicalInspection);
    }

    const createdFunctionalInspections = [];
    for (const item of processedFunctionalInspections) {
        const functionalInspection = await prisma.functionalInspection.create({
            data: {
                inspectionId: inspection.id,
                itemName: item.itemName,
                condition: item.condition,
                notes: item.notes
            }
        });

        if (item.documents.length > 0) {
            await prisma.document.updateMany({
                where: { id: { in: item.documents.map(d => d.id) } },
                data: { functionalInspectionId: functionalInspection.id }
            });
        }

        createdFunctionalInspections.push(functionalInspection);
    }

    const createdDocumentLegalInspections = [];
    for (const item of processedDocumentLegalInspections) {
        const documentLegalInspection = await prisma.documentLegalInspection.create({
            data: {
                inspectionId: inspection.id,
                itemName: item.itemName,
                condition: item.condition,
                notes: item.notes
            }
        });

        if (item.documents.length > 0) {
            await prisma.document.updateMany({
                where: { id: { in: item.documents.map(d => d.id) } },
                data: { documentLegalInspectionId: documentLegalInspection.id }
            });
        }

        createdDocumentLegalInspections.push(documentLegalInspection);
    }

    res.status(201).json({
        success: true,
        message: 'Inspection created successfully',
        data: { inspectionId: inspection.id }
    });
};

// Get all inspections
export const getAllInspections = async (req: Request, res: Response) => {
    const user: any = req.user;

    const where = (user.role === "ADMIN" || user.role === "PLATADMIN") ? {} : { inspectorId: user.id };

    const inspections = await prisma.inspection.findMany({
        where,
        include: {
            exteriorInspections: {
                include: {
                    documents: true
                }
            },
            interiorInspections: {
                include: {
                    documents: true
                }
            },
            mechanicalInspections: {
                include: {
                    documents: true
                }
            },
            functionalInspections: {
                include: {
                    documents: true
                }
            },
            documentLegalInspections: {
                include: {
                    documents: true
                }
            },
            equipment: {
                select: { chasisNumber: true, equipmentName: true, model: true }
            },
            inspector: {
                select: { id: true, firstName: true, lastName: true, serviceNumber: true, email: true }
            }
        },
        orderBy: { datePerformed: 'desc' }
    });

    // Transform the response to match your desired format
    const transformedInspections = inspections.map(inspection => ({
        ...inspection,
        exteriorInspections: inspection.exteriorInspections.map(item => ({
            ...item,
            imageFields: item.documents.map(doc => ({
                fieldName: doc.metadata?.fieldName || 'unknown',
                fileName: doc.fileName,
                url: doc.url,
                mimeType: doc.mimeType,
                fileSize: doc.fileSize
            }))
        })),
        interiorInspections: inspection.interiorInspections.map(item => ({
            ...item,
            imageFields: item.documents.map(doc => ({
                fieldName: doc.metadata?.fieldName || 'unknown',
                fileName: doc.fileName,
                url: doc.url,
                mimeType: doc.mimeType,
                fileSize: doc.fileSize
            }))
        })),
        mechanicalInspections: inspection.mechanicalInspections.map(item => ({
            ...item,
            imageFields: item.documents.map(doc => ({
                fieldName: doc.metadata?.fieldName || 'unknown',
                fileName: doc.fileName,
                url: doc.url,
                mimeType: doc.mimeType,
                fileSize: doc.fileSize
            }))
        })),
        functionalInspections: inspection.functionalInspections.map(item => ({
            ...item,
            imageFields: item.documents.map(doc => ({
                fieldName: doc.metadata?.fieldName || 'unknown',
                fileName: doc.fileName,
                url: doc.url,
                mimeType: doc.mimeType,
                fileSize: doc.fileSize
            }))
        })),
        documentLegalInspections: inspection.documentLegalInspections.map(item => ({
            ...item,
            imageFields: item.documents.map(doc => ({
                fieldName: doc.metadata?.fieldName || 'unknown',
                fileName: doc.fileName,
                url: doc.url,
                mimeType: doc.mimeType,
                fileSize: doc.fileSize
            }))
        }))
    }));

    res.status(200).json({
        success: true,
        data: transformedInspections,
    });
};

// Get single inspection by ID
export const getInspectionById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const inspections = await prisma.inspection.findMany({
        where: { equipmentId: id },
        include: {
            exteriorInspections: {
                include: {
                    documents: true
                }
            },
            interiorInspections: {
                include: {
                    documents: true
                }
            },
            mechanicalInspections: {
                include: {
                    documents: true
                }
            },
            functionalInspections: {
                include: {
                    documents: true
                }
            },
            documentLegalInspections: {
                include: {
                    documents: true
                }
            },
            equipment: true,
            inspector: {
                select: { id: true, firstName: true, lastName: true, serviceNumber: true, email: true }
            }
        }
    });

    if (!inspections || inspections.length === 0) throw new BadRequestError('Inspection not found');

    // Transform the response to match your desired format
    const transformedInspections = inspections.map(inspection => ({
        ...inspection,
        exteriorInspections: inspection.exteriorInspections.map(item => ({
            ...item,
            imageFields: item.documents.map(doc => ({
                fieldName: doc.metadata?.fieldName || 'unknown',
                fileName: doc.fileName,
                url: doc.url,
                mimeType: doc.mimeType,
                fileSize: doc.fileSize
            }))
        })),
        interiorInspections: inspection.interiorInspections.map(item => ({
            ...item,
            imageFields: item.documents.map(doc => ({
                fieldName: doc.metadata?.fieldName || 'unknown',
                fileName: doc.fileName,
                url: doc.url,
                mimeType: doc.mimeType,
                fileSize: doc.fileSize
            }))
        })),
        mechanicalInspections: inspection.mechanicalInspections.map(item => ({
            ...item,
            imageFields: item.documents.map(doc => ({
                fieldName: doc.metadata?.fieldName || 'unknown',
                fileName: doc.fileName,
                url: doc.url,
                mimeType: doc.mimeType,
                fileSize: doc.fileSize
            }))
        })),
        functionalInspections: inspection.functionalInspections.map(item => ({
            ...item,
            imageFields: item.documents.map(doc => ({
                fieldName: doc.metadata?.fieldName || 'unknown',
                fileName: doc.fileName,
                url: doc.url,
                mimeType: doc.mimeType,
                fileSize: doc.fileSize
            }))
        })),
        documentLegalInspections: inspection.documentLegalInspections.map(item => ({
            ...item,
            imageFields: item.documents.map(doc => ({
                fieldName: doc.metadata?.fieldName || 'unknown',
                fileName: doc.fileName,
                url: doc.url,
                mimeType: doc.mimeType,
                fileSize: doc.fileSize
            }))
        }))
    }));

    res.status(200).json({
        success: true,
        data: transformedInspections
    });
};

// Update inspection
export const updateInspection = async (req: Request, res: Response) => {
    const { id } = req.params;
    const {
        nextDueDate,
        overallNotes,
        exteriorInspections,
        interiorInspections,
        mechanicalInspections,
        functionalInspections,
        documentLegalInspections
    } = req.body;

    // Update main inspection
    await prisma.inspection.update({
        where: { id },
        data: {
            nextDueDate: nextDueDate ? new Date(nextDueDate) : undefined,
            overallNotes,
        }
    });

    // Delete existing inspection items and their document links
    await Promise.all([
        prisma.document.updateMany({
            where: { 
                OR: [
                    { exteriorInspectionId: { not: null } },
                    { interiorInspectionId: { not: null } },
                    { mechanicalInspectionId: { not: null } },
                    { functionalInspectionId: { not: null } },
                    { documentLegalInspectionId: { not: null } }
                ],
                inspectionId: id
            },
            data: {
                exteriorInspectionId: null,
                interiorInspectionId: null,
                mechanicalInspectionId: null,
                functionalInspectionId: null,
                documentLegalInspectionId: null
            }
        }),
        prisma.exteriorInspection.deleteMany({ where: { inspectionId: id } }),
        prisma.interiorInspection.deleteMany({ where: { inspectionId: id } }),
        prisma.mechanicalInspection.deleteMany({ where: { inspectionId: id } }),
        prisma.functionalInspection.deleteMany({ where: { inspectionId: id } }),
        prisma.documentLegalInspection.deleteMany({ where: { inspectionId: id } })
    ]);

    // Process new files and recreate inspection items (similar to create logic)
    // ... (implement similar logic as in createInspection)

    const updatedInspection = await prisma.inspection.findUnique({
        where: { id },
        include: {
            exteriorInspections: {
                include: { documents: true }
            },
            interiorInspections: {
                include: { documents: true }
            },
            mechanicalInspections: {
                include: { documents: true }
            },
            functionalInspections: {
                include: { documents: true }
            },
            documentLegalInspections: {
                include: { documents: true }
            },
            equipment: true,
            inspector: {
                select: { id: true, firstName: true, lastName: true, serviceNumber: true, email: true }
            }
        }
    });

    res.status(200).json({
        success: true,
        data: updatedInspection,
        message: 'Inspection updated successfully'
    });
};

// Delete inspection
export const deleteInspection = async (req: Request, res: Response) => {
    const { id } = req.params;

    // This will cascade delete inspection items and unlink documents
    await prisma.inspection.delete({
        where: { id }
    });

    res.json({
        success: true,
        message: 'Inspection deleted successfully'
    });
};
