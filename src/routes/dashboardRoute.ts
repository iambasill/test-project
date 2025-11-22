import { createCategory, deleteCategory, getAllCategory, updateCategory } from '../controller/categoryController';
import { authMiddleware } from '../middlewares/authMiddleware';
import  express  from "express";

export const dashboardRouter = express.Router();


// Base routes
dashboardRouter.get('/dashboard/stats',authMiddleware, getAllCategory);
dashboardRouter.get('/equipment/summary',authMiddleware, createCategory);