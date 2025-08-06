import express from 'express'
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserStatus,
} from '../controller/userController';
import { adminMiddleware } from '../middlewares/adminMiddleware';



export const userRoute = express()

userRoute.get('/', getAllUsers);

userRoute.post('/', getUserById);

userRoute.put('/:id', updateUser);

userRoute.delete('/:id', deleteUser);

userRoute.patch('/status/:id',updateUserStatus);

export default userRoute;