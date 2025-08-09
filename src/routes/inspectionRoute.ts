import  express  from "express";
import { createInspection, getAllInspections } from "../controller/inspectionController";

export const inspectionRouter = express.Router();

inspectionRouter.get('/', getAllInspections);
inspectionRouter.post('/', createInspection);


