import express from 'express'


import {
    getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  approveEquipment,
  authorizeEquipment,
  updateEquipmentStatus

} from '../controller/equipmentController';

export const equipmentRouter = express.Router()


// Basic CRUD operations
equipmentRouter.get('/', getAllEquipment);
equipmentRouter.get('/:id', getEquipmentById);
equipmentRouter.post('/', createEquipment);
equipmentRouter.put('/:id', updateEquipment);
equipmentRouter.delete('/:id', deleteEquipment);

// Workflow operations
equipmentRouter.patch('/:id/approve', approveEquipment);
equipmentRouter.patch('/:id/authorize', authorizeEquipment);
equipmentRouter.patch('/:id/status', updateEquipmentStatus);

export default equipmentRouter;

// Example usage in app.ts:
// app.use('/api/equipment', equipmentRoutes);

