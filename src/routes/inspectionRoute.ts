import  express  from "express";
import { createInspection, getAllInspections, updateInspection } from "../controller/inspectionController";
// import { createInspection, getAllInspections } from "../controller/inspectionController";

export const inspectionRouter = express.Router();

inspectionRouter.get('/', getAllInspections);
inspectionRouter.post('/', createInspection);
inspectionRouter.put('/:id', updateInspection);



