import { upload } from '../services/fileUpload';
import { authMiddleware } from '../middlewares/authMiddleware';
import { UPLOAD_FIELDS } from '../schema/uploadsSchema';
import { createEquipment, createEquipmentOwnership, deleteEquipment, getAllEquipment, getEquipmentById, updateEquipment, getEquipmentOwnerships } from './../controller/equipmentController';
import  express  from "express";

export const equipmentRouter = express.Router();


// Base routes
equipmentRouter.get('/',authMiddleware, getAllEquipment);
equipmentRouter.post('/',authMiddleware, upload.any(), createEquipment);
equipmentRouter.get('/ownership/:id',authMiddleware,getEquipmentOwnerships)


// // Specific equipment routes
equipmentRouter.get('/:id', authMiddleware,getEquipmentById);
equipmentRouter.put('/:id',authMiddleware, upload.any(), updateEquipment);
equipmentRouter.delete('/:id',authMiddleware, deleteEquipment);


equipmentRouter.post('/create-ownership',authMiddleware,createEquipmentOwnership)

