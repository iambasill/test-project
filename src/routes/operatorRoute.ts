import { deleteEquipment } from '../controller/equipmentController';
import { createOperator, deleteOperator, getAllOperator, getAllOperatorById, updateOperator } from '../controller/operatorController';
import  express  from "express";
import { authMiddleware } from '../middlewares/authMiddleware';
import { upload } from '../services/fileUpload';
import { OPERATOR_FIELDS } from '../schema/uploadsSchema';

export const operatorRouter = express.Router();

operatorRouter.get('/', authMiddleware,getAllOperator);
operatorRouter.get('/:id',authMiddleware, getAllOperatorById);
operatorRouter.post('/',authMiddleware,upload.fields(OPERATOR_FIELDS), createOperator);
operatorRouter.put('/:id', authMiddleware,upload.fields(OPERATOR_FIELDS), updateOperator);

