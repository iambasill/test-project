import { authMiddleware } from '../middlewares/authMiddleware';
import express from 'express';
import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  updateUserStatus,
} from '../controller/userController';

export const userRoute = express();


// Base routes - GET with queries/pagination
userRoute.get('/', authMiddleware, getAllUsers);

// Get user by email (POST to send email in body)
userRoute.post('/by-email', authMiddleware, getUserByEmail);

// Activity for specific user

// Specific user routes
userRoute.get('/:id', authMiddleware, getUserById);
userRoute.put('/:id', authMiddleware, updateUser);
userRoute.put('/:id/status', authMiddleware, updateUserStatus);

export default userRoute;