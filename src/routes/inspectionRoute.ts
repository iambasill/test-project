import  express  from "express";
import { createInspection, getAllInspections, getInspectionById, updateInspection } from "../controller/inspectionController";
import { authMiddleware } from "../middlewares/authMiddleware";
// import { createInspection, getAllInspections } from "../controller/inspectionController";

export const inspectionRouter = express.Router();

inspectionRouter.get('/', authMiddleware, getAllInspections);
inspectionRouter.get('/:id', authMiddleware, getInspectionById);
inspectionRouter.post('/', authMiddleware, createInspection);
inspectionRouter.put('/:id', authMiddleware, updateInspection);
inspectionRouter.delete('/:id',authMiddleware,)



