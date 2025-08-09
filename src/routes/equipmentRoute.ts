import { upload } from '../config/fileUpload';
import { authMiddleware } from '../middlewares/authMiddleware';
import { UPLOAD_FIELDS } from '../schema/uploadsSchema';
import { createEquipment, deleteEquipment, getAllEquipment, getEquipmentById, updateEquipment } from './../controller/equipmentController';
import  express  from "express";

export const equipmentRouter = express.Router();


// Base routes
equipmentRouter.get('/', getAllEquipment);
equipmentRouter.post('/', upload.fields(UPLOAD_FIELDS), createEquipment);

// // Specific equipment routes
equipmentRouter.get('/:id', getEquipmentById);
equipmentRouter.put('/:id', upload.fields(UPLOAD_FIELDS), updateEquipment);
equipmentRouter.delete('/:id', deleteEquipment);

