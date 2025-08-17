import  express  from "express";
import { upload } from '../config/fileUpload';
import { createInspection, getAllInspections, getInspectionById,  } from "../controller/inspectionController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const inspectionRouter = express.Router();

inspectionRouter.get('/', authMiddleware, getAllInspections);
inspectionRouter.get('/:id', authMiddleware, getInspectionById);
inspectionRouter.post('/', authMiddleware, upload.any(), createInspection);



