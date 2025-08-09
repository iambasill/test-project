import {Request,Response} from 'express'
import { BadRequestError } from '../httpClass/exceptions';
import { prisma } from '../server';


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
    }
  });
  
  res.status(200).json({
    success: true,
    data: equipment
  });
};

// Get equipment by ID
export const getEquipmentById = async (req:Request, res:Response) => {
  const { chasisNumber } = req.params;
  const equipment = await prisma.equipment.findFirst({
    where: { chasisNumber },
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
      documents: true,
      operators: true
    }
  });
  
  if (!equipment)  throw new BadRequestError('Equipment not found')
  
  res.status(200).json({
    success: true,
  });
};

// Create new equipment
export const createEquipment = async (req:Request, res:Response) => {
   const  {
      chasisNumber,
      equipmentName,
      model,
      equipmentType,
      manufacturer,
      yearOfManufacture,
      countryOfOrigin,
      dateOfAcquisition,
      acquisitionMethod,
      currency,
    } = req.body
 
    const existingEquipment = await prisma.equipment.findFirst({
  where: { chasisNumber }
});

if (existingEquipment) throw new BadRequestError('Equipment with this chassis number already exists');

  
  const equipment = await prisma.equipment.create({
    data: {
       chasisNumber,
      equipmentName,
      model,
      equipmentType,
      manufacturer,
      yearOfManufacture,
      countryOfOrigin,
      dateOfAcquisition,
      acquisitionMethod,
      currency
    
    },
    include: {
      ownerships: true,
      documents: true,
      conditionHistory: true
    }
  });
  
  res.status(201).json({
    success: true,
    message: 'Equipment created successfully',
  });
};

// // Update equipment
// const updateEquipment = async (req, res) => {
//   const { id } = req.params;
//   const updateData = req.body;
  
//   const equipment = await prisma.equipment.update({
//     where: { id },
//     data: {
//       ...updateData,
//       costValue: updateData.costValue ? parseFloat(updateData.costValue) : undefined,
//       weight: updateData.weight ? parseFloat(updateData.weight) : undefined,
//       yearOfManufacture: updateData.yearOfManufacture ? parseInt(updateData.yearOfManufacture) : undefined
//     },
//     include: {
//       ownerships: {
//         where: { isCurrent: true },
//         include: { operator: true }
//       },
//       conditionHistory: {
//         orderBy: { date: 'desc' },
//         take: 5
//       }
//     }
//   });
  
//   res.status(200).json({
//     success: true,
//     message: 'Equipment updated successfully',
//     data: equipment
//   });
// };

// // Delete equipment
// const deleteEquipment = async (req, res) => {
//   const { id } = req.params;
  
//   await prisma.equipment.delete({
//     where: { id }
//   });
  
//   res.status(200).json({
//     success: true,
//     message: 'Equipment deleted successfully'
//   });
// };

// // Get equipment by chassis number
// const getEquipmentByChassisNumber = async (req, res) => {
//   const { chasisNumber } = req.params;
  
//   const equipment = await prisma.equipment.findUnique({
//     where: { chasisNumber },
//     include: {
//       ownerships: {
//         where: { isCurrent: true },
//         include: { operator: true }
//       },
//       conditionHistory: {
//         orderBy: { date: 'desc' },
//         take: 1
//       }
//     }
//   });
  
//   if (!equipment) {
//     return res.status(404).json({
//       success: false,
//       message: 'Equipment not found'
//     });
//   }
  
//   res.status(200).json({
//     success: true,
//     data: equipment
//   });
// };

// // Get equipment by type/category
// const getEquipmentByType = async (req, res) => {
//   const { type } = req.params;
  
//   const equipment = await prisma.equipment.findMany({
//     where: {
//       OR: [
//         { equipmentType: { contains: type, mode: 'insensitive' } },
//         { equipmentCategory: { contains: type, mode: 'insensitive' } }
//       ]
//     },
//     include: {
//       ownerships: {
//         where: { isCurrent: true },
//         include: { operator: true }
//       }
//     }
//   });
  
//   res.status(200).json({
//     success: true,
//     count: equipment.length,
//     data: equipment
//   });
// };

// // Get equipment condition history
// const getEquipmentConditionHistory = async (req, res) => {
//   const { id } = req.params;
  
//   const conditionHistory = await prisma.equipmentCondition.findMany({
//     where: { equipmentId: id },
//     include: {
//       recordedBy: {
//         select: { firstName: true, lastName: true, email: true }
//       },
//       documents: true
//     },
//     orderBy: { date: 'desc' }
//   });
  
//   res.status(200).json({
//     success: true,
//     count: conditionHistory.length,
//     data: conditionHistory
//   });
// };

// // Update equipment condition
// const updateEquipmentCondition = async (req, res) => {
//   const { id } = req.params;
//   const { condition, notes, recordedById } = req.body;
  
//   // Create new condition record
//   const conditionRecord = await prisma.equipmentCondition.create({
//     data: {
//       equipmentId: id,
//       condition,
//       notes,
//       recordedById
//     }
//   });
  
//   // Update equipment current condition
//   const equipment = await prisma.equipment.update({
//     where: { id },
//     data: {
//       currentCondition: condition,
//       lastConditionCheck: new Date()
//     }
//   });
  
//   res.status(200).json({
//     success: true,
//     message: 'Equipment condition updated successfully',
//     data: {
//       equipment,
//       conditionRecord
//     }
//   });
// };

// // Get equipment inspections
// const getEquipmentInspections = async (req, res) => {
//   const { id } = req.params;
  
//   const inspections = await prisma.inspection.findMany({
//     where: { equipmentId: id },
//     include: {
//       inspector: {
//         select: { firstName: true, lastName: true, email: true }
//       },
//       exteriorInspections: true,
//       interiorInspections: true,
//       mechanicalInspections: true,
//       functionalInspections: true,
//       documentLegalInspections: true,
//       documents: true
//     },
//     orderBy: { datePerformed: 'desc' }
//   });
  
//   res.status(200).json({
//     success: true,
//     count: inspections.length,
//     data: inspections
//   });
// };

// // Search equipment
// const searchEquipment = async (req, res) => {
//   const { q, manufacturer, type, condition, year } = req.query;
  
//   const where = {};
  
//   if (q) {
//     where.OR = [
//       { equipmentName: { contains: q, mode: 'insensitive' } },
//       { model: { contains: q, mode: 'insensitive' } },
//       { chasisNumber: { contains: q, mode: 'insensitive' } },
//       { manufacturer: { contains: q, mode: 'insensitive' } }
//     ];
//   }
  
//   if (manufacturer) {
//     where.manufacturer = { contains: manufacturer, mode: 'insensitive' };
//   }
  
//   if (type) {
//     where.equipmentType = { contains: type, mode: 'insensitive' };
//   }
  
//   if (condition) {
//     where.currentCondition = condition;
//   }
  
//   if (year) {
//     where.yearOfManufacture = parseInt(year);
//   }
  
//   const equipment = await prisma.equipment.findMany({
//     where,
//     include: {
//       ownerships: {
//         where: { isCurrent: true },
//         include: { operator: true }
//       }
//     }
//   });
  
//   res.status(200).json({
//     success: true,
//     count: equipment.length,
//     data: equipment
//   });
// };

// // Get equipment statistics
// const getEquipmentStats = async (req, res) => {
//   const totalEquipment = await prisma.equipment.count();
  
//   const conditionStats = await prisma.equipment.groupBy({
//     by: ['currentCondition'],
//     _count: { currentCondition: true }
//   });
  
//   const typeStats = await prisma.equipment.groupBy({
//     by: ['equipmentType'],
//     _count: { equipmentType: true }
//   });
  
//   const manufacturerStats = await prisma.equipment.groupBy({
//     by: ['manufacturer'],
//     _count: { manufacturer: true }
//   });
  
//   const yearStats = await prisma.equipment.groupBy({
//     by: ['yearOfManufacture'],
//     _count: { yearOfManufacture: true },
//     orderBy: { yearOfManufacture: 'desc' }
//   });
  
//   res.status(200).json({
//     success: true,
//     data: {
//       total: totalEquipment,
//       byCondition: conditionStats,
//       byType: typeStats,
//       byManufacturer: manufacturerStats,
//       byYear: yearStats
//     }
//   });
// };


