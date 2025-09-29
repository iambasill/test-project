import { deleteEquipment } from '../controller/equipmentController';
import { createOperator, deleteOperator, getAllOperator, getAllOperatorById, updateOperator } from '../controller/operatorController';
import  express  from "express";
import { authMiddleware } from '../middlewares/authMiddleware';

export const operatorRouter = express.Router();

operatorRouter.get('/', authMiddleware,getAllOperator);
operatorRouter.get('/:id',authMiddleware, getAllOperatorById);
operatorRouter.post('/',authMiddleware, createOperator);
operatorRouter.put('/:id', authMiddleware, updateOperator);

