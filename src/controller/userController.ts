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
            conditionRecords: true,
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
          conditionRecords: true,
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
          conditionRecords: true,
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

// =======================================================
// DELETE USER
// =======================================================
export const deleteUser = async (req: Request, res: Response) => {
  const currentUser: any = req.user;
  let { id } = req.params;
  id = sanitizeInput(id);

  // Prevent users from deleting themselves
  if (currentUser.id === id) {
    throw new BadRequestError('You cannot delete your own account');
  }

  const user = await prismaclient.user.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          inspections: true,
          EquipmentOwnership: true,
          conditionRecords: true,
        },
      },
    },
  });

  if (!user) throw new BadRequestError('User not found');

  // Check if user has critical records
  if (user._count.inspections > 0 || user._count.EquipmentOwnership > 0 || user._count.conditionRecords > 0) {
    throw new BadRequestError(
      'Cannot delete user with existing records (inspections, equipment assignments, or condition records). Consider suspending the account instead.'
    );
  }

  await prismaclient.user.delete({ where: { id } });

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
};

// =======================================================
// GET USER STATISTICS
// =======================================================
export const getUserStats = async (req: Request, res: Response) => {
  const [
    totalUsers,
    byRole,
    byStatus,
    activeUsers,
    inactiveUsers,
    recentLogins,
  ] = await Promise.all([
    prismaclient.user.count(),
    prismaclient.user.groupBy({
      by: ['role'],
      _count: true,
      where: { role: { not: null } },
    }),
    prismaclient.user.groupBy({
      by: ['status'],
      _count: true,
      where: { status: { not: null } },
    }),
    prismaclient.user.count({
      where: { isActive: true },
    }),
    prismaclient.user.count({
      where: { isActive: false },
    }),
    prismaclient.user.findMany({
      where: {
        lastLogin: { not: null },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        lastLogin: true,
      },
      orderBy: { lastLogin: 'desc' },
      take: 10,
    }),
  ]);

  res.status(200).json({
    success: true,
    stats: {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
      byRole,
      byStatus,
      recentLogins,
    },
  });
};

// =======================================================
// GET USER ACTIVITY
// =======================================================
export const getUserActivity = async (req: Request, res: Response) => {
  let { id } = req.params;
  id = sanitizeInput(id);

  const user = await prismaclient.user.findUnique({ where: { id } });
  if (!user) throw new BadRequestError('User not found');

  const [inspections, equipmentAssignments, conditionRecords, sessions] = await Promise.all([
    prismaclient.inspection.findMany({
      where: { inspectorId: id },
      select: {
        id: true,
        datePerformed: true,
        overallCondition: true,
        equipment: {
          select: {
            id: true,
            equipmentName: true,
            chasisNumber: true,
          },
        },
      },
      orderBy: { datePerformed: 'desc' },
      take: 10,
    }),
    prismaclient.equipmentOwnership.findMany({
      where: { userId: id },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        isCurrent: true,
        equipment: {
          select: {
            id: true,
            equipmentName: true,
            chasisNumber: true,
          },
        },
        operator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            serviceNumber: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
      take: 10,
    }),
    prismaclient.equipmentCondition.findMany({
      where: { recordedById: id },
      select: {
        id: true,
        condition: true,
        date: true,
        notes: true,
        equipment: {
          select: {
            id: true,
            equipmentName: true,
            chasisNumber: true,
          },
        },
      },
      orderBy: { date: 'desc' },
      take: 10,
    }),
    prismaclient.user_sessions.findMany({
      where: { user_id: id },
      select: {
        id: true,
        login_time: true,
        logout_time: true,
      },
      orderBy: { login_time: 'desc' },
      take: 10,
    }),
  ]);

  res.status(200).json({
    success: true,
    activity: {
      inspections,
      equipmentAssignments,
      conditionRecords,
      sessions,
    },
  });
};