import { CreateEquipmentOwnershipSchema, equipmentData } from '../schema/schema';
import e, {Request,Response} from 'express'
import { BadRequestError } from '../httpClass/exceptions';
import { PrismaClient } from '../generated/prisma';
import { sanitizeInput } from '../utils/helperFunction';
import sanitize from 'sanitize-html';
import { config } from '../config/envConfig';

const prisma = new PrismaClient()

// Get all equipment
export const getAllEquipment = async (req:Request, res:Response) => {
  const equipment = await prisma.equipment.findMany({
    select:{
      ownerships:{
        where: { isCurrent: true },
        select:{
          startDate:true,
        }
      },
      inspections:{
        select:{
          datePerformed:true
        }
      },
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
  let { id } = req.params;
  id = sanitizeInput(id)
  const equipment = await prisma.equipment.findFirst({
    where: { id },
    include: {
      ownerships: {
        select:{
          startDate: true,
          conditionAtAssignment:true,
          primaryDuties:true
        },
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
        },
        orderBy: { datePerformed: 'desc' }
      },
      documents: {select:{
        fileName:true,
        fileUrl:true
      }},
      operators: {
        select:{

        }
      }
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

  const result = await prisma.$transaction(async (tx) => {
    // Create equipment
    const equipment = await tx.equipment.create({
      data: {
        ...data
      }
    });

    // Create documents if files exist
    if (req.files) {
      const files = req.files as Record<string, Express.Multer.File[]>;
      const fileData = Object.entries(files).map(([fileName, [file]]) => ({
        fileName,
        fileUrl: `${config.API_BASE_URL}/attachment/${file.filename}`,
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
   let { id } = req.params;
   id = sanitizeInput(id)
  const data = equipmentData.parse(req.body);

  const equipment = await prisma.equipment.findFirst({
    where: { id }
  });

  if (!equipment) throw new BadRequestError("Equipment Not found");

    await prisma.$transaction(async (tx) => {
    // Update equipment
     await tx.equipment.update({
      where: { id },
      data: {
        ...data
      }
    });

    // Update documents if files exist
    if (req.files) {
      const files = req.files as Record<string, Express.Multer.File[]>;
      const fileData = Object.entries(files).map(([fileName, [file]]) => ({
        fileName,
        fileUrl: `${config.API_BASE_URL}/attachment/${file.filename}`,
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
              fileUrl: fileInfo.fileUrl
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

  });

  res.status(200).json({
    success: true,
    message: 'Equipment updated successfully',
  });
};

// Delete equipment
export const deleteEquipment = async (req:Request, res:Response) => {
  let { id } = req.params;
  id = sanitize(id)

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


export const createEquipmentOwnership = async (req: Request, res: Response) => {
    const user:any = req.user
    const validatedData = CreateEquipmentOwnershipSchema.parse(req.body);
    
    // Convert string dates to Date objects if provided
    const data = {
      ...validatedData,
      userId: user.id,
      startDate: validatedData.startDate ? new Date(validatedData.startDate) : new Date(),
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
    };
    
    const equipment = await prisma.equipment.findFirst({
        where: {
          id : data.equipmentId,
        }})
      
      if (!equipment) throw new BadRequestError("No equipment found")
        data.equipmentId = equipment.id

        const operator = await prisma.operator.findFirst({
        where: {
          id : data.operatorId,
        }})
      
      if (!operator) throw new BadRequestError("No operator found")
        data.operatorId = operator.id


    // Check if there's already a current ownership for this equipment
      await prisma.$transaction(async (tx) => {

        tx.equipmentOwnership.updateMany({
        where: {
          equipmentId:equipment.id,
          isCurrent: true,
        },
        data: {
          isCurrent: false,
          endDate: new Date(),
        },
      });

        tx.equipmentOwnership.create({
      data,
      });
      })

    res.status(201).json({
      success: true,
      message: 'Equipment ownership created successfully',
    });
  
  }


 
export const getEquipmentOwnerships = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    const equipment = await prisma.equipment.findUnique({
      where:{id},
      })

    if (!equipment) throw new BadRequestError('Equipment not found')



    const ownerships = await prisma.equipmentOwnership.findMany({
      where: { equipmentId:id},
      include: {
          assignedBy:{
            select:{
              firstName            :true,
              lastName             :true,
              serviceNumber        :true,             
              email                :true,                 
              rank                 :true,
              unit                 :true,
            }
          },
          documents:{
            select:{
            id: true,
            fileName: true,
            fileUrl: true,
            createdAt: true
            }
          },
          operator:{
            select:{
              id:true,
              serviceNumber:true,
              firstName:true,
              lastName:true,
              officialEmailAddress:true,
              phoneNumber:true,
              branch:true,
              position:true
            }
          },
          

        },
  });

    res.status(200).json({
      success: true,
      data: ownerships,

    });

};

