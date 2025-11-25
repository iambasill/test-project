import { Request, Response } from 'express';
import { BadRequestError } from '../logger/exceptions';
import { sanitizeInput } from '../utils/helperFunction';
import { signUpSchema } from '../validator/authValidator';
import { prismaclient } from '../lib/prisma-connect';

// =======================================================
// GET USERS WITH QUERIES AND PAGINATION
// =======================================================
export const getAllUsers = async (req: Request, res: Response) => {
  const {
    page = "1",
    limit = "10",
    search,
    role,
    status,
    isActive,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  // Build where clause
  const where: any = {};

  if (search) {
    where.OR = [
      { firstName: { contains: search as string } },
      { lastName: { contains: search as string } },
      { email: { contains: search as string } },
      { serviceNumber: { contains: search as string } },
      { rank: { contains: search as string } },
      { unit: { contains: search as string } },
    ];
  }

  if (role) where.role = role;
  if (status) where.status = status;
  if (isActive !== undefined) {
    where.isActive = isActive === "true";
  }

  // Build orderBy
  const orderBy: any = {};
  orderBy[sortBy as string] = sortOrder;

  const [users, total] = await Promise.all([
    prismaclient.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        serviceNumber: true,
        rank: true,
        unit: true,
        role: true,
        status: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            inspections: true,
            EquipmentOwnership: true,
          },
        },
      },
      orderBy,
      skip,
      take: limitNum,
    }),
    prismaclient.user.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
};

// =======================================================
// GET USER BY ID
// =======================================================
export const getUserById = async (req: Request, res: Response) => {
  let { id } = req.params;
  id = sanitizeInput(id);

  const user = await prismaclient.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      serviceNumber: true,
      rank: true,
      unit: true,
      role: true,
      status: true,
      isActive: true,
      lastLogin: true,
      loginAttempt: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          inspections: true,
          EquipmentOwnership: true,
          User_sessions: true,
        },
      },
    },
  });

  if (!user) throw new BadRequestError('User not found');

  res.status(200).json({
    success: true,
    data: user,
  });
};

// =======================================================
// GET USER BY EMAIL
// =======================================================
export const getUserByEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await prismaclient.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      serviceNumber: true,
      rank: true,
      unit: true,
      role: true,
      status: true,
      isActive: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          inspections: true,
          EquipmentOwnership: true,
        },
      },
    },
  });

  if (!user) throw new BadRequestError('User not found');

  res.status(200).json({
    success: true,
    data: user,
  });
};

// =======================================================
// UPDATE USER
// =======================================================
export const updateUser = async (req: Request, res: Response) => {
  const user: any = req.user;
  let { id } = req.params;
  id = sanitizeInput(id);

  const { email, firstName, lastName, role, serviceNumber, rank, unit } = req.body;

  const existingUser = await prismaclient.user.findFirst({
    where: { id },
  });

  if (!existingUser) throw new BadRequestError('User not found');

  // Check if email is being changed and if new email already exists
  if (email && email !== existingUser.email) {
    const emailExists = await prismaclient.user.findFirst({
      where: {
        email,
        id: { not: id },
      },
    });

    if (emailExists) throw new BadRequestError('Email already in use by another user');
  }

  // Check if service number is being changed and if new service number already exists
  if (serviceNumber && serviceNumber !== existingUser.serviceNumber) {
    const serviceNumberExists = await prismaclient.user.findFirst({
      where: {
        serviceNumber,
        id: { not: id },
      },
    });

    if (serviceNumberExists) throw new BadRequestError('Service number already in use by another user');
  }

  const updateData: any = {};
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;
  if (role) updateData.role = role;
  if (email) updateData.email = email;
  if (serviceNumber) updateData.serviceNumber = serviceNumber;
  if (rank) updateData.rank = rank;
  if (unit) updateData.unit = unit;

  await prismaclient.user.update({
    where: { id },
    data: updateData,
  });

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
  });
};

// =======================================================
// UPDATE USER STATUS
// =======================================================
export const updateUserStatus = async (req: Request, res: Response) => {
  let { id } = req.params;
  let { status } = req.body;
  id = sanitizeInput(id);
  status = sanitizeInput(status);

  const user = await prismaclient.user.findUnique({ where: { id } });
  if (!user) throw new BadRequestError('User not found');

  // Validate status
  const validStatuses = ['PENDING', 'ACTIVE', 'SUSPENDED'];
  if (!validStatuses.includes(status)) {
    throw new BadRequestError('Invalid status. Must be PENDING, ACTIVE, or SUSPENDED');
  }

  await prismaclient.user.update({
    where: { id },
    data: { status },
  });

  res.status(200).json({
    success: true,
    message: 'User status updated successfully',
  });
};


