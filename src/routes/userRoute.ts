import { authMiddleware } from '../middlewares/authMiddleware';
import express from 'express';
import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  updateUserStatus,
  deleteUser,
  getUserStats,
  getUserActivity,
} from '../controller/userController';

export const userRoute = express();

// Statistics route (should be before :id route to avoid conflicts)
userRoute.get('/stats', authMiddleware, getUserStats);

// Base routes - GET with queries/pagination
userRoute.get('/', authMiddleware, getAllUsers);

// Get user by email (POST to send email in body)
userRoute.post('/by-email', authMiddleware, getUserByEmail);

// Activity for specific user
userRoute.get('/:id/activity', authMiddleware, getUserActivity);

// Specific user routes
userRoute.get('/:id', authMiddleware, getUserById);
userRoute.put('/:id', authMiddleware, updateUser);
userRoute.put('/status/:id', authMiddleware, updateUserStatus);
userRoute.delete('/:id', authMiddleware, deleteUser);

export default userRoute;