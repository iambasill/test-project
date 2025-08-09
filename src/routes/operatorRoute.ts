import { createOperator, getAllOperator } from '../controller/operatorController';
import  express  from "express";

export const operatorRouter = express.Router();

operatorRouter.get('/', getAllOperator);
operatorRouter.post('/', createOperator);
