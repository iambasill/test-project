import  express  from "express";
import { upload } from '../config/fileUpload';
import { createInspection, getAllInspections, getInspectionById,  } from "../controller/inspectionController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { UPLOAD_FIELDS } from "../schema/uploadsSchema";

export const inspectionRouter = express.Router();

inspectionRouter.get('/', authMiddleware, getAllInspections);
inspectionRouter.get('/:id', authMiddleware, getInspectionById);
inspectionRouter.post('/', authMiddleware, upload.none(), createInspection);



