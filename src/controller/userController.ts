import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../server';
import { BadRequestError, unAuthorizedError } from '../httpClass/exceptions';
import { User } from '../generated/prisma';


export const getAllUsers = async (req: Request, res: Response) => {
  
  const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: users,
    });
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
    const {email} = req.body;
    const user = await prisma.user.findUnique({
      where: { email},
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) throw new BadRequestError('Users not found')
    

    res.status(200).json({
      success: true,
      data: user,
    });
};


// Update user
export const updateUser = async (req: Request, res: Response) => {
    const user:any = req.user
    const { id } = req.params;


    const { email, firstName, lastName, role, status, password } = req.body;
    const existingUser = await prisma.user.findFirst({
     where: { email }
    });

    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (role) updateData.role = role;
    if (status) updateData.status = status;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

     const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
    });
  }

// // Delete user
// export const deleteUser = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     await prisma.user.delete({
//       where: { id },
//     });

//     res.status(200).json({
//       success: true,
//       message: 'User deleted successfully',
//     });
  
// };

// Update user status
export const updateUserStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const {status} = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {status}
    });

    res.status(200).json({
      success: true,
      message: 'User status updated successfully',
     
    });
  }
 