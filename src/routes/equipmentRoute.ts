import { createEquipment, getAllEquipment } from './../controller/equipmentController';
import  express  from "express";

export const equipmentRouter = express.Router();


// Base routes
equipmentRouter.get('/', getAllEquipment);
equipmentRouter.post('/', createEquipment);

// // Specific equipment routes
// equipmentRouter.get('/:id', getEquipmentById);
// equipmentRouter.put('/:id', updateEquipment);
// equipmentRouter.delete('/:id', deleteEquipment);

// // Equipment by chassis number

// // Equipment by type

// // Condition management
// equipmentRouter.get('/:id/conditions', getEquipmentConditionHistory);
// equipmentRouter.post('/:id/conditions', updateEquipmentCondition);

// // Inspection management
