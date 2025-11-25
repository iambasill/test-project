import { authMiddleware } from '../middlewares/authMiddleware';
import  express  from "express";
import { requireAuditors,  } from '../middlewares/rbacMiddleware';
import { getDashboardStats } from '../controller/dashboardController';

export const dashboardRouter = express.Router();


// Base routes
dashboardRouter.get('/dashboard/stats',authMiddleware, requireAuditors, getDashboardStats);

