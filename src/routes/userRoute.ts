import { authMiddleware } from '../middlewares/authMiddleware';
import express from 'express';
import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  updateUserStatus,
} from '../controller/userController';
import { requireAdmins } from '../middlewares/rbacMiddleware';

export const userRoute = express();


// Base routes - GET with queries/pagination
userRoute.get('/', authMiddleware,requireAdmins, getAllUsers);

// Get user by email (POST to send email in body)
userRoute.post('/by-email', authMiddleware, getUserByEmail);

// Activity for specific user

// Specific user routes
userRoute.get('/:id', authMiddleware,requireAdmins, getUserById);
userRoute.put('/:id', authMiddleware, requireAdmins,updateUser);
userRoute.put('/:id/status', authMiddleware, requireAdmins, updateUserStatus);

export default userRoute;