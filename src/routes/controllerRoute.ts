import { createCategory, deleteCategory, getAllCategory, updateCategory } from '../controller/categoryController';
import { requirePlatformAdmin } from '../middlewares/adminMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';
import  express  from "express";

export const categoryRouter = express.Router();


// Base routes
categoryRouter.get('/',authMiddleware,requirePlatformAdmin, getAllCategory);
categoryRouter.post('/',authMiddleware,requirePlatformAdmin, createCategory);
categoryRouter.put('/:id',authMiddleware, requirePlatformAdmin,updateCategory);
categoryRouter.delete('/:id',authMiddleware,requirePlatformAdmin, deleteCategory);



