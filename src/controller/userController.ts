import { Request, Response } from 'express';
import { BadRequestError, unAuthorizedError } from '../logger/exceptions';
import { sanitizeInput } from '../utils/helperFunction';
import { signUpSchema } from '../validator/authValidator';
import { prismaclient } from '../lib/prisma-connect';



export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prismaclient.user.findMany({
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
    const user = await prismaclient.user.findUnique({
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
    let { id } = req.params;
    id = sanitizeInput(id)


    const { email, firstName, lastName, role } = signUpSchema.parse(req.body);
    const existingUser = await prismaclient.user.findFirst({
     where: { email }
    });

    if (!existingUser) throw new BadRequestError("User not found")

    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (role) updateData.role = role;

     const updatedUser = await prismaclient.user.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
    });
  }


// Update user status
export const updateUserStatus = async (req: Request, res: Response) => {
    let { id } = req.params;
    let  {status} = req.body;
    id = sanitizeInput(id)
    status =sanitizeInput(status)

    const updatedUser = await prismaclient.user.update({
      where: { id },
      data: {status}
    });

    res.status(200).json({
      success: true,
      message: 'User status updated successfully',
     
    });
  }
 