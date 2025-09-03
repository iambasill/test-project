import { upload } from '../config/fileUpload';
import { authMiddleware } from '../middlewares/authMiddleware';
import { UPLOAD_FIELDS } from '../schema/uploadsSchema';
import { createEquipment, createEquipmentOwnership, deleteEquipment, getAllEquipment, getEquipmentById, updateEquipment, getOwnershipHistoryByEquipment } from './../controller/equipmentController';
import  express  from "express";

export const equipmentRouter = express.Router();


// Base routes
equipmentRouter.get('/', getAllEquipment);
equipmentRouter.post('/',upload.fields(UPLOAD_FIELDS), createEquipment);
equipmentRouter.get('/ownership/:id',getOwnershipHistoryByEquipment)

// // Specific equipment routes
equipmentRouter.get('/:id', authMiddleware,getEquipmentById);
equipmentRouter.put('/:id',authMiddleware, upload.fields(UPLOAD_FIELDS), updateEquipment);
equipmentRouter.delete('/:id',authMiddleware, deleteEquipment);


equipmentRouter.post('/create-ownership',authMiddleware,createEquipmentOwnership)

