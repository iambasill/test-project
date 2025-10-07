import { authMiddleware } from './../middlewares/authMiddleware';
import express from 'express'
import {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserStatus,
} from '../controller/userController';



export const userRoute = express()

userRoute.get('/', authMiddleware,getAllUsers);

userRoute.post('/', authMiddleware,getUserById);

userRoute.put('/:id', authMiddleware,updateUser);

userRoute.put('/status/:id',authMiddleware,updateUserStatus);

export default userRoute;