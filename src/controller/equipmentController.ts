import { equipmentData } from '../schema/schema';
import e, {Request,Response} from 'express'
import { BadRequestError } from '../httpClass/exceptions';
import { prisma } from '../server';
import { fileHandler } from '../utils/filerHandler';


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
      documents: true
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
    const data = equipmentData.parse(req.body)

    
 
  const existingEquipment = await prisma.equipment.findFirst({
  where: { chasisNumber:data.chasisNumber}
});

if (existingEquipment) throw new BadRequestError('Equipment with this chassis number already exists');
  
  const equipment = await prisma.equipment.create({
    data: {
      ...data
    },
    include: {
      ownerships: true,
      documents: true,
      conditionHistory: true
    }
  });

    if (req.files) {
    const fileData = fileHandler(req.files)

    await prisma.document.createMany({
      data: fileData
    });


  }
  
  res.status(201).json({
    success: true,
    message: 'Equipment created successfully',
  });
};

// Update equipment
export const updateEquipment = async (req:Request, res:Response) => {
  const { id } = req.params;
  
   const data = equipmentData.parse(req.body)


  const equipment = await prisma.equipment.findFirst({
    where:{id}
  })
  if (!equipment) throw new BadRequestError("Equipment Not found")

  const updatedEquipment = await prisma.equipment.update({
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

    if (req.files) {
    const fileData = fileHandler(req.files)

    await prisma.document.updateMany({
      where:{equipmentChasisNumber:equipment.chasisNumber},
      data: fileData
    });
    };

  
  
  res.status(200).json({
    success: true,
    message: 'Equipment updated successfully'
  });
};

// Delete equipment
export const deleteEquipment = async (req:Request, res:Response) => {
  const { id } = req.params;

  const equipment = await prisma.equipment.findFirst({
    where:{id}
  })
  if (!equipment) throw new BadRequestError("Equipment Not found")


  
  await prisma.equipment.delete({
    where: { id }
  });
  
  res.status(200).json({
    success: true,
    message: 'Equipment deleted successfully'
  });
};


