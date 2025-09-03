import { CreateEquipmentOwnershipSchema, equipmentData } from '../schema/schema';
import e, {Request,Response} from 'express'
import { BadRequestError } from '../httpClass/exceptions';
import { prisma } from '../server';
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
      await prisma.equipmentOwnership.updateMany({
        where: {
          isCurrent: true,
        },
        data: {
          isCurrent: false,
          endDate: new Date(),
        },
      });

      await prisma.equipmentOwnership.create({
      data,
      });

    res.status(201).json({
      success: true,
      message: 'Equipment ownership created successfully',
    });
  
  }

export const getOwnershipHistoryByEquipment = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    const equipment = await prisma.equipment.findFirst({where:{id}})
    if (!equipment) throw new BadRequestError('Equipment not found')



    const equipmentOwnership = await prisma.equipmentOwnership.findMany({
      where: { equipmentId:id},
           include: {
          equipment: true,
          operator: true,
          documents: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
    });

    if (!equipmentOwnership) throw new BadRequestError('Equipment ownership not found'),

    res.status(200).json({
      success: true,
      data: equipmentOwnership,
    });
  
  }


// export const getEquipmentOwnerships = async (req: Request, res: Response) => {
//   try {
//     const { page, limit, equipmentChasisNumber, operatorId, isCurrent } = QuerySchema.parse(req.query);
    
//     const skip = (page - 1) * limit;
    
//     const where: any = {};
//     if (equipmentChasisNumber) where.equipmentChasisNumber = equipmentChasisNumber;
//     if (operatorId) where.operatorId = operatorId;
//     if (isCurrent !== undefined) where.isCurrent = isCurrent;

//     const [ownerships, total] = await Promise.all([
//       prisma.equipmentOwnership.findMany({
//         where,
//         skip,
//         take: limit,
//         include: {
//           equipment: true,
//           operator: true,
//           documents: true,
//         },
//         orderBy: {
//           createdAt: 'desc',
//         },
//       }),
//       prisma.equipmentOwnership.count({ where }),
//     ]);

//     res.json({
//       success: true,
//       data: ownerships,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid query parameters',
//         errors: error.errors,
//       });
//     }

//     console.error('Get equipment ownerships error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//     });
//   }
// };


// export const updateEquipmentOwnership = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
    
//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         message: 'Equipment ownership ID is required',
//       });
//     }

//     const validatedData = UpdateEquipmentOwnershipSchema.parse(req.body);
    
//     // Convert string dates to Date objects if provided
//     const updateData: any = { ...validatedData };
//     if (validatedData.startDate) updateData.startDate = new Date(validatedData.startDate);
//     if (validatedData.endDate) updateData.endDate = new Date(validatedData.endDate);

//     // Check if ownership exists
//     const existingOwnership = await prisma.equipmentOwnership.findUnique({
//       where: { id },
//     });

//     if (!existingOwnership) {
//       return res.status(404).json({
//         success: false,
//         message: 'Equipment ownership not found',
//       });
//     }

//     // If setting as current, update other current ownerships for the same equipment
//     if (updateData.isCurrent === true && updateData.equipmentChasisNumber) {
//       await prisma.equipmentOwnership.updateMany({
//         where: {
//           equipmentChasisNumber: updateData.equipmentChasisNumber,
//           isCurrent: true,
//           id: { not: id },
//         },
//         data: {
//           isCurrent: false,
//           endDate: new Date(),
//         },
//       });
//     }

//     const updatedOwnership = await prisma.equipmentOwnership.update({
//       where: { id },
//       data: updateData,
//       include: {
//         equipment: true,
//         operator: true,
//         documents: true,
//       },
//     });

//     res.json({
//       success: true,
//       data: updatedOwnership,
//       message: 'Equipment ownership updated successfully',
//     });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: error.errors,
//       });
//     }

//     console.error('Update equipment ownership error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//     });
//   }
// };

// export const deleteEquipmentOwnership = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
    
//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         message: 'Equipment ownership ID is required',
//       });
//     }

//     const existingOwnership = await prisma.equipmentOwnership.findUnique({
//       where: { id },
//     });

//     if (!existingOwnership) {
//       return res.status(404).json({
//         success: false,
//         message: 'Equipment ownership not found',
//       });
//     }

//     await prisma.equipmentOwnership.delete({
//       where: { id },
//     });

//     res.json({
//       success: true,
//       message: 'Equipment ownership deleted successfully',
//     });
//   } catch (error) {
//     console.error('Delete equipment ownership error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//     });
//   }
// };

// export const getCurrentOwnershipByEquipment = async (req: Request, res: Response) => {
//   try {
//     const { chasisNumber } = req.params;
    
//     if (!chasisNumber) {
//       return res.status(400).json({
//         success: false,
//         message: 'Equipment chassis number is required',
//       });
//     }

//     const currentOwnership = await prisma.equipmentOwnership.findFirst({
//       where: {
//         equipmentChasisNumber: chasisNumber,
//         isCurrent: true,
//       },
//       include: {
//         equipment: true,
//         operator: true,
//         documents: true,
//       },
//     });

//     if (!currentOwnership) {
//       return res.status(404).json({
//         success: false,
//         message: 'No current ownership found for this equipment',
//       });
//     }

//     res.json({
//       success: true,
//       data: currentOwnership,
//     });
//   } catch (error) {
//     console.error('Get current ownership error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//     });
//   }
// };

// export const getOwnershipHistoryByEquipment = async (req: Request, res: Response) => {
//   try {
//     const { chasisNumber } = req.params;
//     const { page = 1, limit = 10 } = QuerySchema.parse(req.query);
    
//     if (!chasisNumber) {
//       return res.status(400).json({
//         success: false,
//         message: 'Equipment chassis number is required',
//       });
//     }

//     const skip = (page - 1) * limit;

//     const [ownerships, total] = await Promise.all([
//       prisma.equipmentOwnership.findMany({
//         where: {
//           equipmentChasisNumber: chasisNumber,
//         },
//         skip,
//         take: limit,
//         include: {
//           equipment: true,
//           operator: true,
//           documents: true,
//         },
//         orderBy: {
//           startDate: 'desc',
//         },
//       }),
//       prisma.equipmentOwnership.count({
//         where: {
//           equipmentChasisNumber: chasisNumber,
//         },
//       }),
//     ]);

//     res.json({
//       success: true,
//       data: ownerships,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid query parameters',
//         errors: error.errors,
//       });
//     }

//     console.error('Get ownership history error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//     });
//   }
// };

// export const transferEquipmentOwnership = async (req: Request, res: Response) => {
//   try {
//     const validatedData = TransferSchema.parse(req.body);
//     const transferDate = validatedData.transferDate ? new Date(validatedData.transferDate) : new Date();

//     // Start transaction
//     const result = await prisma.$transaction(async (tx) => {
//       // End current ownership
//       await tx.equipmentOwnership.updateMany({
//         where: {
//           equipmentChasisNumber: validatedData.equipmentChasisNumber,
//           isCurrent: true,
//         },
//         data: {
//           isCurrent: false,
//           endDate: transferDate,
//         },
//       });

//       // Create new ownership
//       const newOwnership = await tx.equipmentOwnership.create({
//         data: {
//           equipmentChasisNumber: validatedData.equipmentChasisNumber,
//           operatorId: validatedData.newOperatorId,
//           startDate: transferDate,
//           isCurrent: true,
//           conditionAtAssignment: validatedData.conditionAtAssignment,
//           notes: validatedData.notes,
//           primaryDuties: validatedData.primaryDuties,
//           driverLicenseId: validatedData.driverLicenseId,
//           coFirstName: validatedData.coFirstName,
//           coLastName: validatedData.coLastName,
//           coEmail: validatedData.coEmail,
//           coPhoneNumber: validatedData.coPhoneNumber,
//         },
//         include: {
//           equipment: true,
//           operator: true,
//           documents: true,
//         },
//       });

//       return newOwnership;
//     });

//     res.json({
//       success: true,
//       data: result,
//       message: 'Equipment ownership transferred successfully',
//     });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: error.errors,
//       });
//     }

//     console.error('Transfer equipment ownership error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//     });
//   }
// };

// export const getOwnershipsByOperator = async (req: Request, res: Response) => {
//   try {
//     const { operatorId } = req.params;
//     const { page = 1, limit = 10, isCurrent } = QuerySchema.parse(req.query);
    
//     if (!operatorId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Operator ID is required',
//       });
//     }

//     const skip = (page - 1) * limit;
//     const where: any = { operatorId };
//     if (isCurrent !== undefined) where.isCurrent = isCurrent;

//     const [ownerships, total] = await Promise.all([
//       prisma.equipmentOwnership.findMany({
//         where,
//         skip,
//         take: limit,
//         include: {
//           equipment: true,
//           operator: true,
//           documents: true,
//         },
//         orderBy: {
//           startDate: 'desc',
//         },
//       }),
//       prisma.equipmentOwnership.count({ where }),
//     ]);

//     res.json({
//       success: true,
//       data: ownerships,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid query parameters',
//         errors: error.errors,
//       });
//     }

//     console.error('Get ownerships by operator error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//     });
//   }
// };

// export const endCurrentOwnership = async (req: Request, res: Response) => {
//   try {
//     const EndOwnershipSchema = z.object({
//       equipmentChasisNumber: z.string().min(1, 'Equipment chassis number is required'),
//       endDate: z.string().datetime().optional(),
//       notes: z.string().optional().nullable(),
//     });

//     const { equipmentChasisNumber, endDate, notes } = EndOwnershipSchema.parse(req.body);
//     const endDateTime = endDate ? new Date(endDate) : new Date();

//     const updatedOwnership = await prisma.equipmentOwnership.updateMany({
//       where: {
//         equipmentChasisNumber,
//         isCurrent: true,
//       },
//       data: {
//         isCurrent: false,
//         endDate: endDateTime,
//         notes: notes || undefined,
//       },
//     });

//     if (updatedOwnership.count === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'No current ownership found for this equipment',
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Equipment ownership ended successfully',
//       data: { affectedRecords: updatedOwnership.count },
//     });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: error.errors,
//       });
//     }

//     console.error('End ownership error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//     });
//   }
// };

// // Helper function to get ownership statistics
// export const getOwnershipStats = async (req: Request, res: Response) => {
//   try {
//     const [
//       totalOwnerships,
//       currentOwnerships,
//       completedOwnerships,
//       avgOwnershipDuration,
//     ] = await Promise.all([
//       prisma.equipmentOwnership.count(),
//       prisma.equipmentOwnership.count({ where: { isCurrent: true } }),
//       prisma.equipmentOwnership.count({ where: { isCurrent: false } }),
//       prisma.equipmentOwnership.aggregate({
//         where: {
//           isCurrent: false,
//           endDate: { not: null },
//         },
//         _avg: {
//           // Note: This would need custom SQL for actual duration calculation
//         },
//       }),
//     ]);

//     res.json({
//       success: true,
//       data: {
//         totalOwnerships,
//         currentOwnerships,
//         completedOwnerships,
//         // avgDurationDays: avgOwnershipDuration, // Would need custom calculation
//       },
//     });
//   } catch (error) {
//     console.error('Get ownership stats error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//     });
//   }
// };