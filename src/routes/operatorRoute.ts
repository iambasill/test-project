import { deleteEquipment } from '../controller/equipmentController';
import { createOperator, deleteOperator, getAllOperator, updateOperator } from '../controller/operatorController';
import  express  from "express";

export const operatorRouter = express.Router();

operatorRouter.get('/', getAllOperator);
operatorRouter.get('/:id', getAllOperator);
operatorRouter.post('/', createOperator);
operatorRouter.put('/:id', updateOperator);
operatorRouter.delete('/:id', deleteOperator);

