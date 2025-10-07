import  express  from "express";
import { upload } from '../services/fileUpload';
import { createInspection, deleteInspection, getAllInspections, getInspectionById,  } from "../controller/inspectionController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requirePlatformAdmin } from "../middlewares/adminMiddleware";

export const inspectionRouter = express.Router();

inspectionRouter.get('/', authMiddleware, getAllInspections);
inspectionRouter.get('/:id', authMiddleware, getInspectionById);
inspectionRouter.post('/', authMiddleware, upload.any(), createInspection);
inspectionRouter.delete('/:id',authMiddleware,requirePlatformAdmin,deleteInspection)



