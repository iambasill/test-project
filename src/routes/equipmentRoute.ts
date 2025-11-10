import upload  from '../services/fileUpload';
import { authMiddleware } from '../middlewares/authMiddleware';
import { UPLOAD_FIELDS } from '../validator/uploadsValidator';
import { createEquipment, createEquipmentOwnership, deleteEquipment, getAllEquipment, getEquipmentById, updateEquipment, getEquipmentOwnerships } from './../controller/equipmentController';
import  express  from "express";

export const equipmentRouter = express.Router();


// Base routes
equipmentRouter.get('/',authMiddleware, getAllEquipment);
equipmentRouter.post('/',authMiddleware, upload.fields(UPLOAD_FIELDS), createEquipment);
equipmentRouter.get('/ownership/:id',authMiddleware,getEquipmentOwnerships)


// // Specific equipment routes
equipmentRouter.get('/:id', authMiddleware,getEquipmentById);
equipmentRouter.put('/:id',authMiddleware, upload.fields(UPLOAD_FIELDS), updateEquipment);
equipmentRouter.delete('/:id',authMiddleware, deleteEquipment);


equipmentRouter.post('/create-ownership',authMiddleware,createEquipmentOwnership)

