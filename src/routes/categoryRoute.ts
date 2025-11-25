// import { createCategory, deleteCategory, getAllCategory, updateCategory } from '../controller/categoryController';
import { requireAdmins } from '../middlewares/rbacMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';
import  express  from "express";

export const categoryRouter = express.Router();


// // Base routes
// categoryRouter.get('/',authMiddleware,requireAdmins, getAllCategory);
// categoryRouter.post('/',authMiddleware,requireAdmins, createCategory);
// categoryRouter.put('/:id',authMiddleware, requireAdmins,updateCategory);
// categoryRouter.delete('/:id',authMiddleware,requireAdmins, deleteCategory);



