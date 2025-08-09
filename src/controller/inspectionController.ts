import { BadRequestError } from "../httpClass/exceptions";
import { prisma } from "../server";
import {Request, Response} from 'express'


// Get all inspections
export const getAllInspections = async (req:Request, res:Response) => {
    const inspections = await prisma.inspection.findMany({
      include: {
        equipment: {
          select: {
            chasisNumber: true,
            equipmentName: true,
            model: true,
            equipmentType: true,
            currentCondition: true
          }
        },
        inspector: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            rank: true,
            unit: true
          }
        },
        exteriorInspections: true,
        interiorInspections: true,
        mechanicalInspections: true,
        functionalInspections: true,
        documentLegalInspections: true,
        documents: true
      },
      orderBy: { datePerformed: 'desc' }
    });
    
    res.status(200).json({
      success: true,
      data: inspections
    });
};

// Get inspection by ID
export const getInspectionById = async(req:Request, res:Response) => {
    const { id } = req.params;
    
    const inspection = await prisma.inspection.findUnique({
      where: { id },
      include: {
        equipment: true,
        inspector: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            rank: true,
            unit: true
          }
        },
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
        documents: true
      }
    });
    
    if (!inspection) throw new BadRequestError('Inspection not found')
     
    res.status(200).json({
      success: true,
      data: inspection
    });

};

// Create new inspection
export const createInspection = async (req:Request, res:Response) => {
    const userId = req.user
    const {
      equipmentChasisNumber, 
      nextDueDate,
      overallNotes,
      exteriorInspections = [],
      interiorInspections = [],
      mechanicalInspections = [],
      functionalInspections = [],
      documentLegalInspections = []
    } = req.body;
    
    // Validate that equipment exists
    const equipment = await prisma.equipment.findUnique({
      where: { chasisNumber: equipmentChasisNumber }
    });
    
    if (!equipment)  throw new BadRequestError('Equipment with provided chassis number not found')
 
    const inspection = await prisma.inspection.create({
      data: {
        equipmentChasisNumber,
        inspectorId:userId,
        nextDueDate: nextDueDate ? new Date(nextDueDate) : null,
        overallNotes,
        exteriorInspections: {
          create: exteriorInspections
        },
        interiorInspections: {
          create: interiorInspections
        },
        mechanicalInspections: {
          create: mechanicalInspections
        },
        functionalInspections: {
          create: functionalInspections
        },
        documentLegalInspections: {
          create: documentLegalInspections
        }
      },
      include: {
        equipment: {
          select: {
            chasisNumber: true,
            equipmentName: true,
            model: true
          }
        },
        inspector: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        exteriorInspections: true,
        interiorInspections: true,
        mechanicalInspections: true,
        functionalInspections: true,
        documentLegalInspections: true
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'Inspection created successfully',
      data: inspection
    });

};

// // Update inspection
// const updateInspection = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       inspectorId,
//       nextDueDate,
//       overallNotes
//     } = req.body;
    
//     const inspection = await prisma.inspection.update({
//       where: { id },
//       data: {
//         inspectorId,
//         nextDueDate: nextDueDate ? new Date(nextDueDate) : null,
//         overallNotes
//       },
//       include: {
//         equipment: {
//           select: {
//             chasisNumber: true,
//             equipmentName: true,
//             model: true
//           }
//         },
//         inspector: {
//           select: {
//             firstName: true,
//             lastName: true,
//             email: true
//           }
//         }
//       }
//     });
    
//     res.status(200).json({
//       success: true,
//       message: 'Inspection updated successfully',
//       data: inspection
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating inspection',
//       error: error.message
//     });
//   }
// };

// // Delete inspection
// const deleteInspection = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     await prisma.inspection.delete({
//       where: { id }
//     });
    
//     res.status(200).json({
//       success: true,
//       message: 'Inspection deleted successfully'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting inspection',
//       error: error.message
//     });
//   }
// };

// // Get inspections by equipment chassis number
// const getInspectionsByEquipmentChasisNumber = async (req, res) => {
//   try {
//     const { chasisNumber } = req.params; // Changed from equipmentId
    
//     const inspections = await prisma.inspection.findMany({
//       where: { equipmentChasisNumber: chasisNumber }, // Updated field name
//       include: {
//         inspector: {
//           select: {
//             firstName: true,
//             lastName: true,
//             email: true,
//             rank: true
//           }
//         },
//         exteriorInspections: true,
//         interiorInspections: true,
//         mechanicalInspections: true,
//         functionalInspections: true,
//         documentLegalInspections: true
//       },
//       orderBy: { datePerformed: 'desc' }
//     });
    
//     res.status(200).json({
//       success: true,
//       count: inspections.length,
//       data: inspections
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching inspections by equipment',
//       error: error.message
//     });
//   }
// };

// // Get inspections by inspector
// const getInspectionsByInspector = async (req, res) => {
//   try {
//     const { inspectorId } = req.params;
    
//     const inspections = await prisma.inspection.findMany({
//       where: { inspectorId },
//       include: {
//         equipment: {
//           select: {
//             chasisNumber: true,
//             equipmentName: true,
//             model: true,
//             currentCondition: true
//           }
//         },
//         exteriorInspections: true,
//         interiorInspections: true,
//         mechanicalInspections: true,
//         functionalInspections: true,
//         documentLegalInspections: true
//       },
//       orderBy: { datePerformed: 'desc' }
//     });
    
//     res.status(200).json({
//       success: true,
//       count: inspections.length,
//       data: inspections
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching inspections by inspector',
//       error: error.message
//     });
//   }
// };

// // Get overdue inspections
// const getOverdueInspections = async (req, res) => {
//   try {
//     const currentDate = new Date();
    
//     const overdueInspections = await prisma.inspection.findMany({
//       where: {
//         nextDueDate: {
//           lt: currentDate
//         }
//       },
//       include: {
//         equipment: {
//           select: {
//             chasisNumber: true,
//             equipmentName: true,
//             model: true,
//             currentCondition: true
//           }
//         },
//         inspector: {
//           select: {
//             firstName: true,
//             lastName: true,
//             email: true
//           }
//         }
//       },
//       orderBy: { nextDueDate: 'asc' }
//     });
    
//     res.status(200).json({
//       success: true,
//       count: overdueInspections.length,
//       data: overdueInspections
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching overdue inspections',
//       error: error.message
//     });
//   }
// };

// // Get upcoming inspections
// const getUpcomingInspections = async (req, res) => {
//   try {
//     const { days = 30 } = req.query;
//     const currentDate = new Date();
//     const futureDate = new Date();
//     futureDate.setDate(currentDate.getDate() + parseInt(days));
    
//     const upcomingInspections = await prisma.inspection.findMany({
//       where: {
//         nextDueDate: {
//           gte: currentDate,
//           lte: futureDate
//         }
//       },
//       include: {
//         equipment: {
//           select: {
//             chasisNumber: true,
//             equipmentName: true,
//             model: true,
//             currentCondition: true
//           }
//         },
//         inspector: {
//           select: {
//             firstName: true,
//             lastName: true,
//             email: true
//           }
//         }
//       },
//       orderBy: { nextDueDate: 'asc' }
//     });
    
//     res.status(200).json({
//       success: true,
//       count: upcomingInspections.length,
//       data: upcomingInspections
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching upcoming inspections',
//       error: error.message
//     });
//   }
// };

// // Add exterior inspection item
// const addExteriorInspection = async (req, res) => {
//   try {
//     const { inspectionId } = req.params;
//     const { itemName, condition, notes } = req.body;
    
//     const exteriorInspection = await prisma.exteriorInspection.create({
//       data: {
//         inspectionId,
//         itemName,
//         condition,
//         notes
//       }
//     });
    
//     res.status(201).json({
//       success: true,
//       message: 'Exterior inspection item added successfully',
//       data: exteriorInspection
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error adding exterior inspection item',
//       error: error.message
//     });
//   }
// };

// // Add interior inspection item
// const addInteriorInspection = async (req, res) => {
//   try {
//     const { inspectionId } = req.params;
//     const { itemName, condition, notes } = req.body;
    
//     const interiorInspection = await prisma.interiorInspection.create({
//       data: {
//         inspectionId,
//         itemName,
//         condition,
//         notes
//       }
//     });
    
//     res.status(201).json({
//       success: true,
//       message: 'Interior inspection item added successfully',
//       data: interiorInspection
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error adding interior inspection item',
//       error: error.message
//     });
//   }
// };

// // Add mechanical inspection item
// const addMechanicalInspection = async (req, res) => {
//   try {
//     const { inspectionId } = req.params;
//     const { itemName, condition, notes } = req.body;
    
//     const mechanicalInspection = await prisma.mechanicalInspection.create({
//       data: {
//         inspectionId,
//         itemName,
//         condition,
//         notes
//       }
//     });
    
//     res.status(201).json({
//       success: true,
//       message: 'Mechanical inspection item added successfully',
//       data: mechanicalInspection
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error adding mechanical inspection item',
//       error: error.message
//     });
//   }
// };

// // Add functional inspection item
// const addFunctionalInspection = async (req, res) => {
//   try {
//     const { inspectionId } = req.params;
//     const { itemName, condition, notes } = req.body;
    
//     const functionalInspection = await prisma.functionalInspection.create({
//       data: {
//         inspectionId,
//         itemName,
//         condition,
//         notes
//       }
//     });
    
//     res.status(201).json({
//       success: true,
//       message: 'Functional inspection item added successfully',
//       data: functionalInspection
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error adding functional inspection item',
//       error: error.message
//     });
//   }
// };

// // Add document/legal inspection item
// const addDocumentLegalInspection = async (req, res) => {
//   try {
//     const { inspectionId } = req.params;
//     const { itemName, condition, notes } = req.body;
    
//     const documentLegalInspection = await prisma.documentLegalInspection.create({
//       data: {
//         inspectionId,
//         itemName,
//         condition,
//         notes
//       }
//     });
    
//     res.status(201).json({
//       success: true,
//       message: 'Document/Legal inspection item added successfully',
//       data: documentLegalInspection
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error adding document/legal inspection item',
//       error: error.message
//     });
//   }
// };

// // Update inspection item (generic for all types)
// const updateInspectionItem = async (req, res) => {
//   try {
//     const { type, itemId } = req.params;
//     const { itemName, condition, notes } = req.body;
    
//     let updatedItem;
    
//     if (type === 'exterior') {
//       updatedItem = await prisma.exteriorInspection.update({
//         where: { id: itemId },
//         data: { itemName, condition, notes }
//       });
//     } else if (type === 'interior') {
//       updatedItem = await prisma.interiorInspection.update({
//         where: { id: itemId },
//         data: { itemName, condition, notes }
//       });
//     } else if (type === 'mechanical') {
//       updatedItem = await prisma.mechanicalInspection.update({
//         where: { id: itemId },
//         data: { itemName, condition, notes }
//       });
//     } else if (type === 'functional') {
//       updatedItem = await prisma.functionalInspection.update({
//         where: { id: itemId },
//         data: { itemName, condition, notes }
//       });
//     } else if (type === 'document-legal') {
//       updatedItem = await prisma.documentLegalInspection.update({
//         where: { id: itemId },
//         data: { itemName, condition, notes }
//       });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid inspection type'
//       });
//     }
    
//     res.status(200).json({
//       success: true,
//       message: `${type} inspection item updated successfully`,
//       data: updatedItem
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating inspection item',
//       error: error.message
//     });
//   }
// };

// // Delete inspection item (generic for all types)
// const deleteInspectionItem = async (req, res) => {
//   try {
//     const { type, itemId } = req.params;
    
//     if (type === 'exterior') {
//       await prisma.exteriorInspection.delete({ where: { id: itemId } });
//     } else if (type === 'interior') {
//       await prisma.interiorInspection.delete({ where: { id: itemId } });
//     } else if (type === 'mechanical') {
//       await prisma.mechanicalInspection.delete({ where: { id: itemId } });
//     } else if (type === 'functional') {
//       await prisma.functionalInspection.delete({ where: { id: itemId } });
//     } else if (type === 'document-legal') {
//       await prisma.documentLegalInspection.delete({ where: { id: itemId } });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid inspection type'
//       });
//     }
    
//     res.status(200).json({
//       success: true,
//       message: `${type} inspection item deleted successfully`
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting inspection item',
//       error: error.message
//     });
//   }
// };

// // Get inspection statistics
// const getInspectionStats = async (req, res) => {
//   try {
//     const totalInspections = await prisma.inspection.count();
    
//     const currentDate = new Date();
//     const overdueCount = await prisma.inspection.count({
//       where: {
//         nextDueDate: {
//           lt: currentDate
//         }
//       }
//     });
    
//     const futureDate = new Date();
//     futureDate.setDate(currentDate.getDate() + 30);
//     const upcomingCount = await prisma.inspection.count({
//       where: {
//         nextDueDate: {
//           gte: currentDate,
//           lte: futureDate
//         }
//       }
//     });
    
//     const inspectionsByMonth = await prisma.inspection.groupBy({
//       by: ['datePerformed'],
//       _count: { id: true },
//       orderBy: { datePerformed: 'desc' }
//     });
    
//     const inspectionsByEquipmentType = await prisma.inspection.groupBy({
//       by: ['equipmentChasisNumber'], // Updated field name
//       _count: { equipmentChasisNumber: true } // Updated field name
//     });
    
//     res.status(200).json({
//       success: true,
//       data: {
//         total: totalInspections,
//         overdue: overdueCount,
//         upcoming: upcomingCount,
//         byMonth: inspectionsByMonth,
//         byEquipmentType: inspectionsByEquipmentType
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching inspection statistics',
//       error: error.message
//     });
//   }
// };

// // Search inspections
// const searchInspections = async (req, res) => {
//   try {
//     const { q, equipmentType, condition, inspector, dateFrom, dateTo } = req.query;
    
//     const where = {};
    
//     if (dateFrom || dateTo) {
//       where.datePerformed = {};
//       if (dateFrom) where.datePerformed.gte = new Date(dateFrom);
//       if (dateTo) where.datePerformed.lte = new Date(dateTo);
//     }
    
//     if (inspector) {
//       where.inspector = {
//         OR: [
//           { firstName: { contains: inspector, mode: 'insensitive' } },
//           { lastName: { contains: inspector, mode: 'insensitive' } },
//           { email: { contains: inspector, mode: 'insensitive' } }
//         ]
//       };
//     }
    
//     if (equipmentType) {
//       where.equipment = {
//         equipmentType: { contains: equipmentType, mode: 'insensitive' }
//       };
//     }
    
//     if (q) {
//       where.OR = [
//         { overallNotes: { contains: q, mode: 'insensitive' } },
//         {
//           equipment: {
//             OR: [
//               { equipmentName: { contains: q, mode: 'insensitive' } },
//               { chasisNumber: { contains: q, mode: 'insensitive' } },
//               { model: { contains: q, mode: 'insensitive' } }
//             ]
//           }
//         }
//       ];
//     }
    
//     const inspections = await prisma.inspection.findMany({
//       where,
//       include: {
//         equipment: {
//           select: {
//             chasisNumber: true,
//             equipmentName: true,
//             model: true,
//             equipmentType: true
//           }
//         },
//         inspector: {
//           select: {
//             firstName: true,
//             lastName: true,
//             email: true
//           }
//         }
//       },
//       orderBy: { datePerformed: 'desc' }
//     });
    
//     res.status(200).json({
//       success: true,
//       count: inspections.length,
//       data: inspections
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error searching inspections',
//       error: error.message
//     });
//   }
// };

// module.exports = {
//   getAllInspections,
//   getInspectionById,
//   createInspection,
//   updateInspection,
//   deleteInspection,
//   getInspectionsByEquipmentChasisNumber, // Updated function name
//   getInspectionsByInspector,
//   getOverdueInspections,
//   getUpcomingInspections,
//   addExteriorInspection,
//   addInteriorInspection,
//   addMechanicalInspection,
//   addFunctionalInspection,
//   addDocumentLegalInspection,
//   updateInspectionItem,
//   deleteInspectionItem,
//   getInspectionStats,
//   searchInspections
// };
