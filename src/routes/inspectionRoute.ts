import  express  from "express";
import upload  from '../services/multerService';
import { createInspection, getAllInspectionByEquipmentId,  } from "../controller/inspectionController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { INSPECTION_FIELDS } from "../validator/uploadsValidator";
import { requireIdempotencyKey } from "../middlewares/idempotencyKeyMiddleware";

export const inspectionRouter = express.Router();

inspectionRouter.get('/equipment/:id', authMiddleware, getAllInspectionByEquipmentId);
inspectionRouter.post('/', authMiddleware, requireIdempotencyKey,  upload.fields(INSPECTION_FIELDS), createInspection);

// inspectionRouter.delete('/:id',authMiddleware,requirePlatformAdmin,deleteInspection)



