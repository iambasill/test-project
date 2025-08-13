import { Request, Response } from "express";
import { prisma } from "../server";
import { BadRequestError, unAuthorizedError } from "../httpClass/exceptions";

// Create a new inspection
export const createInspection = async (req:Request, res:Response) => {
    const {
        equipmentId,
        nextDueDate,
        overallNotes,
        exteriorInspections = [],
        interiorInspections = [],
        mechanicalInspections = [],
        functionalInspections = [],
        documentLegalInspections = []
    } = req.body;

    const user: any = req.user
    const files = req.files || [];


const equipment = await prisma.equipment.findUnique({
  where: { id: equipmentId }
});

if (!equipment) {
  throw new Error(`Equipment with ID ${equipmentId} not found`);
}

    const inspection = await prisma.inspection.create({
        data: {
            equipmentId,
            inspectorId:user.id,
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

    });

//     // Handle document uploads if files exist
//    if (req.files) {
//     const files = req.files as Record<string, Express.Multer.File[]>;
//     const fileData = Object.entries(files).map(([fileName, [file]]) => ({
//       fileName,
//       url: file.path.toString(),
//       inspectionId: inspection.id
//     }));

//     await prisma.document.createMany({
//       data: fileData
//     });

   
    res.status(201).json({
        success: true,
        message: 'Inspection created successfully'
    });
};

// Get all inspections
export const getAllInspections = async (req:Request, res:Response) => {
    const user:any = req.user

    const where = (user.role == "ADMIN") ? {} : {inspectorId:user.id}

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
                select: { id: true, firstName: true,lastName:true, serviceNumber:true, email: true }
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
export const getInspectionById = async (req:Request, res:Response) => {
    const { id } = req.params;
    const inspection = await prisma.inspection.findUnique({
        where: { id },
        include: {
            exteriorInspections: true,
            interiorInspections: true,
            mechanicalInspections: true,
            functionalInspections: true,
            documentLegalInspections: true,
            documents: true,
            equipment: true,
            inspector: {
                select: { id: true, firstName: true,lastName:true, serviceNumber:true, email: true }
            }
        }
    });

    if (!inspection) throw new BadRequestError('Inspection not found')


    res.status(200).json({
        success: true,
        data: inspection
    });
};

// Update inspection
export const updateInspection = async (req:Request, res:Response) => {
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

    const files = req.files || [];

    const inspection = await prisma.inspection.update({
        where: { id },
        data: {
        nextDueDate,
        overallNotes,
        exteriorInspections,
        interiorInspections,
        mechanicalInspections,
        functionalInspections,
        documentLegalInspections
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

       if (req.files) {
    const files = req.files as Record<string, Express.Multer.File[]>;
    const fileData = Object.entries(files).map(([fileName, [file]]) => ({
      fileName,
      url: file.path.toString(),
    }));

    await prisma.document.updateMany({
    where:{
        inspectionId:inspection.id
    },
      data: fileData
    });
       }

    const updatedInspection = await prisma.inspection.findUnique({
        where: { id },
        include: {
            exteriorInspections: true,
            interiorInspections: true,
            mechanicalInspections: true,
            functionalInspections: true,
            documentLegalInspections: true,
            documents: true,
            equipment: true,
            inspector: {
                select: { id: true, firstName: true,lastName:true, serviceNumber:true, email: true }
            }
    }
    })

    res.status(200).json({
        success: true,
        data: updatedInspection,
        message: 'Inspection updated successfully'
    });
}

// Delete inspection
export const deleteInspection = async (req:Request, res:Response) => {
    const { id } = req.params;

    await prisma.inspection.delete({
        where: { id }
    });

    res.json({
        success: true,
        message: 'Inspection deleted successfully'
    });
};

