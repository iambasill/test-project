import { equipmentData } from '../schema/schema';
import e, {Request,Response} from 'express'
import { BadRequestError } from '../httpClass/exceptions';
import { prisma } from '../server';
import { fileHandler } from '../utils/filerHandler';
import { API_BASE_URL } from '../../secrets';


// Get all equipment
export const getAllEquipment = async (req:Request, res:Response) => {
  const equipment = await prisma.equipment.findMany({
    include: {
      ownerships: {
        where: { isCurrent: true },
        include: {
          operator: true
        }
      },
      conditionHistory: {
        orderBy: { date: 'desc' },
      },
      inspections: {
        orderBy: { datePerformed: 'desc' },
      },
        documents: {select:{
        fileName:true,
        url:true
      }},
    },
    orderBy:{ createdAt: 'desc' }
  });
  
  res.status(200).json({
    success: true,
    data: equipment
  });
};

// Get equipment by ID
export const getEquipmentById = async (req:Request, res:Response) => {
  const { id } = req.params;
  const equipment = await prisma.equipment.findFirst({
    where: { id },
    include: {
      ownerships: {
        include: {
          operator: true,
          documents: true
        }
      },
      conditionHistory: {
        include: {
          recordedBy: true
        },
        orderBy: { date: 'desc' }
      },
      inspections: {
        include: {
          inspector: true,
          exteriorInspections: true,
          interiorInspections: true,
          mechanicalInspections: true,
          functionalInspections: true,
          documentLegalInspections: true
        },
        orderBy: { datePerformed: 'desc' }
      },
      documents: {select:{
        fileName:true,
        url:true
      }},
      operators: true
    }
  });
  
  if (!equipment)  throw new BadRequestError('Equipment not found')
  
  res.status(200).json({
    success: true,
    equipment
  });
};

// Create new equipment
export const createEquipment = async (req:Request, res:Response) => {
  const data = equipmentData.parse(req.body);

  // Check for existing equipment before starting transaction
  const existingEquipment = await prisma.equipment.findFirst({
    where: { chasisNumber: data.chasisNumber }
  });

  if (existingEquipment) {
    throw new BadRequestError('Equipment with this chassis number already exists');
  }

  // Use Prisma transaction to ensure atomicity
  const result = await prisma.$transaction(async (tx) => {
    // Create equipment
    const equipment = await tx.equipment.create({
      data: {
        ...data
      },
      include: {
        ownerships: true,
        documents: true,
        conditionHistory: true
      }
    });

    // Create documents if files exist
    if (req.files) {
      const files = req.files as Record<string, Express.Multer.File[]>;
      const fileData = Object.entries(files).map(([fileName, [file]]) => ({
        fileName,
        url: `${API_BASE_URL}/attachment/${file.filename}`,
        equipmentId: equipment.id
      }));

      await tx.document.createMany({
        data: fileData,
      });
    }

    return equipment;
  });

  res.status(201).json({
    success: true,
    message: 'Equipment created successfully',
  });
};

// Update equipment
export const updateEquipment = async (req:Request, res:Response) => {
   const { id } = req.params;
  const data = equipmentData.parse(req.body);

  const equipment = await prisma.equipment.findFirst({
    where: { id }
  });

  if (!equipment) throw new BadRequestError("Equipment Not found");

  // Use Prisma transaction to ensure atomicity
  const result = await prisma.$transaction(async (tx) => {
    // Update equipment
    const updatedEquipment = await tx.equipment.update({
      where: { id },
      data: {
        ...data
      },
      include: {
        ownerships: {
          where: { isCurrent: true },
          include: { operator: true }
        },
        conditionHistory: {
          orderBy: { date: 'desc' },
        }
      }
    });

    // Update documents if files exist
    if (req.files) {
      const files = req.files as Record<string, Express.Multer.File[]>;
      const fileData = Object.entries(files).map(([fileName, [file]]) => ({
        fileName,
        url: `${API_BASE_URL}/attachment/${file.filename}`,
        equipmentId: equipment.id
      }));

      // Only update/replace the documents that were actually uploaded
      for (const fileInfo of fileData) {
        // Check if document with this fileName already exists
        const existingDocument = await tx.document.findFirst({
          where: {
            equipmentId: equipment.id,
            fileName: fileInfo.fileName
          }
        });

        if (existingDocument) {
          // Update existing document
          await tx.document.update({
            where: { id: existingDocument.id },
            data: {
              url: fileInfo.url
            }
          });
        } else {
          // Create new document if it doesn't exist
          await tx.document.create({
            data: fileInfo
          });
        }
      }
    }

    return updatedEquipment;
  });

  res.status(200).json({
    success: true,
    message: 'Equipment updated successfully',
    data: result
  });
};

// Delete equipment
export const deleteEquipment = async (req:Request, res:Response) => {
  const { id } = req.params;

  await prisma.$transaction(async(tx)=>{
     const equipment = await tx.equipment.findFirst({
    where:{id}
  })
  if (!equipment) throw new BadRequestError("Equipment Not found")

  await tx.equipment.delete({
    where: { id }
  });

  })
 
  res.status(200).json({
    success: true,
    message: 'Equipment deleted successfully'
  });
};


