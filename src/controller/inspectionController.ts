import { Request, Response } from "express";
import { prisma } from "../server";

// Create a new inspection
export const createInspection = async (req:Request, res:Response) => {
    const {
        equipmentChasisNumber,
        inspectorId,
        nextDueDate,
        overallNotes,
        exteriorInspections = [],
        interiorInspections = [],
        mechanicalInspections = [],
        functionalInspections = [],
        documentLegalInspections = []
    } = req.body;

    const files = req.files || [];

    const inspection = await prisma.inspection.create({
        data: {
            equipmentChasisNumber,
            inspectorId:req.user?.userID,
            nextDueDate: nextDueDate ? new Date(nextDueDate) : null,
            overallNotes,
            exteriorInspections: {
                create: exteriorInspections.map((item:any) => ({
                    itemName: item.itemName,
                    condition: item.condition,
                    notes: item.notes
                }))
            },
            interiorInspections: {
                create: interiorInspections.map((item:any) => ({
                    itemName: item.itemName,
                    condition: item.condition,
                    notes: item.notes
                })) 
            },
            mechanicalInspections: {
                create: mechanicalInspections.map((item:any) => ({
                    itemName: item.itemName,
                    condition: item.condition,
                    notes: item.notes
                }))
            },
            functionalInspections: {
                create: functionalInspections.map((item:any) => ({
                    itemName: item.itemName,
                    condition: item.condition,
                    notes: item.notes
                }))
            },
            documentLegalInspections: {
                create: documentLegalInspections.map((item:any) => ({
                    itemName: item.itemName,
                    condition: item.condition,
                    notes: item.notes
                }))
            }
        },
        include: {
            exteriorInspections: true,
            interiorInspections: true,
            mechanicalInspections: true,
            functionalInspections: true,
            documentLegalInspections: true,
            documents: true
        }
    });

    // Handle document uploads if files exist
   if (req.files) {
    const files = req.files as Record<string, Express.Multer.File[]>;
    const fileData = Object.entries(files).map(([fileName, [file]]) => ({
      fileName,
      url: file.path.toString(),
      equipmentId: equipmentChasisNumber
    }));

    await prisma.document.createMany({
      data: fileData
    });

    const finalInspection = await prisma.inspection.findUnique({
        where: { id: inspection.id },
        include: {
            exteriorInspections: true,
            interiorInspections: true,
            mechanicalInspections: true,
            functionalInspections: true,
            documentLegalInspections: true,
            documents: true,
            equipment: true,
            inspector: {
                select: { id: true, firstName: true,lastName: true, email: true,serviceNumber:true }
            }
        }
    });

    res.status(201).json({
        success: true,
        data: finalInspection,
        message: 'Inspection created successfully'
    });
};
}
// // Get all inspections
// const getAllInspections = async (req, res) => {
//     const { page = 1, limit = 10, equipmentChasisNumber, inspectorId } = req.query;
//     const skip = (page - 1) * limit;

//     const where = {};
//     if (equipmentChasisNumber) where.equipmentChasisNumber = equipmentChasisNumber;
//     if (inspectorId) where.inspectorId = inspectorId;

//     const inspections = await prisma.inspection.findMany({
//         where,
//         skip: parseInt(skip),
//         take: parseInt(limit),
//         include: {
//             exteriorInspections: true,
//             interiorInspections: true,
//             mechanicalInspections: true,
//             functionalInspections: true,
//             documentLegalInspections: true,
//             documents: true,
//             equipment: {
//                 select: { chasisNumber: true, make: true, model: true }
//             },
//             inspector: {
//                 select: { id: true, name: true, email: true }
//             }
//         },
//         orderBy: { datePerformed: 'desc' }
//     });

//     const total = await prisma.inspection.count({ where });

//     res.json({
//         success: true,
//         data: inspections,
//         pagination: {
//             total,
//             page: parseInt(page),
//             limit: parseInt(limit),
//             pages: Math.ceil(total / limit)
//         }
//     });
// };

// // Get single inspection by ID
// const getInspectionById = async (req, res) => {
//     const { id } = req.params;

//     const inspection = await prisma.inspection.findUnique({
//         where: { id },
//         include: {
//             exteriorInspections: true,
//             interiorInspections: true,
//             mechanicalInspections: true,
//             functionalInspections: true,
//             documentLegalInspections: true,
//             documents: true,
//             equipment: true,
//             inspector: {
//                 select: { id: true, name: true, email: true }
//             }
//         }
//     });

//     if (!inspection) {
//         return res.status(404).json({
//             success: false,
//             message: 'Inspection not found'
//         });
//     }

//     res.json({
//         success: true,
//         data: inspection
//     });
// };

// // Update inspection
// const updateInspection = async (req, res) => {
//     const { id } = req.params;
//     const {
//         inspectorId,
//         nextDueDate,
//         overallNotes,
//         exteriorInspections,
//         interiorInspections,
//         mechanicalInspections,
//         functionalInspections,
//         documentLegalInspections
//     } = req.body;

//     const files = req.files || [];

//     const updateData = {};
//     if (inspectorId !== undefined) updateData.inspectorId = inspectorId;
//     if (nextDueDate !== undefined) updateData.nextDueDate = nextDueDate ? new Date(nextDueDate) : null;
//     if (overallNotes !== undefined) updateData.overallNotes = overallNotes;

//     const inspection = await prisma.inspection.update({
//         where: { id },
//         data: updateData,
//         include: {
//             exteriorInspections: true,
//             interiorInspections: true,
//             mechanicalInspections: true,
//             functionalInspections: true,
//             documentLegalInspections: true,
//             documents: true
//         }
//     });

//     // Handle new document uploads if files exist
//     if (files && files.length > 0) {
//         const documentsData = files.map(file => ({
//             url: file.path || file.location,
//             fileName: file.originalname,
//             fileSize: file.size,
//             mimeType: file.mimetype,
//             description: `Inspection document - ${file.originalname}`,
//             inspectionId: inspection.id
//         }));

//         await prisma.document.createMany({
//             data: documentsData
//         });
//     }

//     const updatedInspection = await prisma.inspection.findUnique({
//         where: { id },
//         include: {
//             exteriorInspections: true,
//             interiorInspections: true,
//             mechanicalInspections: true,
//             functionalInspections: true,
//             documentLegalInspections: true,
//             documents: true,
//             equipment: true,
//             inspector: {
//                 select: { id: true, name: true, email: true }
//             }
//         }
//     });

//     res.json({
//         success: true,
//         data: updatedInspection,
//         message: 'Inspection updated successfully'
//     });
// };

// // Delete inspection
// const deleteInspection = async (req, res) => {
//     const { id } = req.params;

//     await prisma.inspection.delete({
//         where: { id }
//     });

//     res.json({
//         success: true,
//         message: 'Inspection deleted successfully'
//     });
// };

// // Get inspections by equipment chassis number
// const getInspectionsByEquipment = async (req, res) => {
//     const { chasisNumber } = req.params;
//     const { page = 1, limit = 10 } = req.query;
//     const skip = (page - 1) * limit;

//     const inspections = await prisma.inspection.findMany({
//         where: { equipmentChasisNumber: chasisNumber },
//         skip: parseInt(skip),
//         take: parseInt(limit),
//         include: {
//             exteriorInspections: true,
//             interiorInspections: true,
//             mechanicalInspections: true,
//             functionalInspections: true,
//             documentLegalInspections: true,
//             documents: true,
//             inspector: {
//                 select: { id: true, name: true, email: true }
//             }
//         },
//         orderBy: { datePerformed: 'desc' }
//     });

//     const total = await prisma.inspection.count({
//         where: { equipmentChasisNumber: chasisNumber }
//     });

//     res.json({
//         success: true,
//         data: inspections,
//         pagination: {
//             total,
//             page: parseInt(page),
//             limit: parseInt(limit),
//             pages: Math.ceil(total / limit)
//         }
//     });
// };

// // Add documents to existing inspection
// const addDocumentsToInspection = async (req, res) => {
//     const { id } = req.params;
//     const files = req.files || [];

//     if (!files || files.length === 0) {
//         return res.status(400).json({
//             success: false,
//             message: 'No files provided'
//         });
//     }

//     const documentsData = files.map(file => ({
//         url: file.path || file.location,
//         fileName: file.originalname,
//         fileSize: file.size,
//         mimeType: file.mimetype,
//         description: `Inspection document - ${file.originalname}`,
//         inspectionId: id
//     }));

//     await prisma.document.createMany({
//         data: documentsData
//     });

//     const inspection = await prisma.inspection.findUnique({
//         where: { id },
//         include: {
//             documents: true
//         }
//     });

//     res.json({
//         success: true,
//         data: inspection,
//         message: 'Documents added successfully'
//     });
// };

// // Update specific inspection category item
// const updateInspectionItem = async (req, res) => {
//     const { type, itemId } = req.params;
//     const { condition, notes } = req.body;
//     const files = req.files || [];

//     const validTypes = ['exterior', 'interior', 'mechanical', 'functional', 'documentLegal'];
//     if (!validTypes.includes(type)) {
//         return res.status(400).json({
//             success: false,
//             message: 'Invalid inspection type'
//         });
//     }

//     const modelMap = {
//         exterior: 'exteriorInspection',
//         interior: 'interiorInspection',
//         mechanical: 'mechanicalInspection',
//         functional: 'functionalInspection',
//         documentLegal: 'documentLegalInspection'
//     };

//     const updateData = {};
//     if (condition !== undefined) updateData.condition = condition;
//     if (notes !== undefined) updateData.notes = notes;

//     const updatedItem = await prisma[modelMap[type]].update({
//         where: { id: itemId },
//         data: updateData
//     });

//     // Handle document uploads for this specific item
//     if (files && files.length > 0) {
//         const documentsData = files.map(file => ({
//             url: file.path || file.location,
//             fileName: file.originalname,
//             fileSize: file.size,
//             mimeType: file.mimetype,
//             description: `${type} inspection document - ${file.originalname}`,
//             [`${type}InspectionId`]: itemId
//         }));

//         await prisma.document.createMany({
//             data: documentsData
//         });
//     }

//     res.json({
//         success: true,
//         data: updatedItem,
//         message: 'Inspection item updated successfully'
//     });
// };

