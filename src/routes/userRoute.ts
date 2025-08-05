import express from 'express'
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserStatus,
} from '../controller/userController';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';



export const userRoute = express()

userRoute.get('/', authMiddleware,getAllUsers);

userRoute.post('/', authMiddleware,getUserById);

userRoute.put('/:id', authMiddleware,updateUser);

userRoute.delete('/:id', authMiddleware,deleteUser);

userRoute.patch('/status/:id', authMiddleware,updateUserStatus);

export default userRoute;