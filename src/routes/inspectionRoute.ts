6import  express  from "express";
import { upload } from '../config/fileUpload';
import { createInspection, getAllInspections, getInspectionById, updateInspection } from "../controller/inspectionController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const inspectionRouter = express.Router();

inspectionRouter.get('/', authMiddleware, getAllInspections);
inspectionRouter.get('/:id', authMiddleware, getInspectionById);
inspectionRouter.post('/', authMiddleware, upload.any(), createInspection);
inspectionRouter.put('/:id', authMiddleware, updateInspection);
//inspectionRouter.delete('/:id',authMiddleware,)



