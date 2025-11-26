import { Request, Response } from "express";
import { prismaclient } from "../lib/prisma-connect";
import { User } from "../generated/prisma";
import { unAuthorizedError } from "../logger/exceptions";

// =======================================================
// GET COMPREHENSIVE DASHBOARD STATISTICS
// =======================================================
export const getDashboardStats = async (req: Request, res: Response) => {
  const user = req.user as User;
 
  const [
    totalOperators,
    totalEquipment,
    assignedEquipment,
    unassignedEquipment,
    totalInspections,
    usersByRole,
    equipmentByequipmentType,
    serviceableEquipment,
    equipmentByCondition,
    recentInspections,
    pendingInspections,
    userStats,
  ] = await Promise.all([
    // Total operators count
    prismaclient.operator.count(),

    // Total equipment
    prismaclient.equipment.count(),

    // Assigned equipment
    prismaclient.equipmentOwnership.count({
      where: { isCurrent: true },
    }),

    // Unassigned equipment
    prismaclient.equipment.count({
      where: {
        ownerships: {
          none: { isCurrent: true },
        },
      },
    }),

    // Total inspections
    prismaclient.inspection.count(),

    // Users grouped by role
    prismaclient.user.groupBy({
      by: ["role"],
      _count: {
        id: true,
      },
      where: { role: { not: null } },
    }),

    // Equipment grouped by equipmentType (replaced equipmentType)
    prismaclient.equipment.groupBy({
      by: ["equipmentType"],
      _count: {
        id: true,
      },
      where: {
        equipmentType: { not: null }
      }
    }),

    // Serviceable equipment (condition "S")
    prismaclient.equipment.count({
      where: {
        currentCondition: "S",
      },
    }),

    // Equipment breakdown by condition
    prismaclient.equipment.groupBy({
      by: ["currentCondition"],
      _count: {
        id: true,
      },
    }),

    // Recent inspections (last 7 days)
    prismaclient.inspection.findMany({
      where: {
        datePerformed: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      select: {
        id: true,
        datePerformed: true,
        overallCondition: true,
        equipment: {
          select: {
            equipmentName: true,
            chasisNumber: true,
          },
        },
        inspector: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { datePerformed: "desc" },
      take: 10,
    }),

    // Pending inspections (equipment without recent inspections)
    prismaclient.inspection.count({
      where: {
        datePerformed: {
          lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    }),

    // User stats by role
    prismaclient.user.findMany({
      select: {
        id: true,
        role: true,
        isActive: true,
        _count: {
          select: {
            inspections: true,
            EquipmentOwnership: true,
            recordedConditions: true,
          },
        },
      },
      where: { role: { not: null } },
    }),
  ]);

  // Format users by role for frontend
  const usersByRoleFormatted = usersByRole.reduce((acc: any, item) => {
    const role = item.role;
    if (!role) return acc;
    acc[role] = item._count.id;
    return acc;
  }, {} as Record<string, number>);

  // Format equipment by vehicle type
  const equipmentByequipmentTypeFormatted = equipmentByequipmentType.map((item) => ({
    type: item.equipmentType,
    count: item._count?.id || 0,
  }));

  // Format equipment by condition
  const equipmentByConditionFormatted = equipmentByCondition.reduce(
    (acc: Record<string, number>, item) => {
      const key = item.currentCondition ?? "UNKNOWN";
      acc[key] = item._count?.id || 0;
      return acc;
    },
    {} as Record<string, number>
  );

  // Summarize user stats by role
  const userStatsFormatted: any = {
    OFFICER: { count: 0, active: 0, inspections: 0, assignments: 0, conditionsRecorded: 0 },
    ADMIN: { count: 0, active: 0, inspections: 0, assignments: 0, conditionsRecorded: 0 },
    AUDITOR: { count: 0, active: 0, inspections: 0, assignments: 0, conditionsRecorded: 0 },
    MANAGER: { count: 0, active: 0, inspections: 0, assignments: 0, conditionsRecorded: 0 },
    PLATADMIN: { count: 0, active: 0, inspections: 0, assignments: 0, conditionsRecorded: 0 },
  };

  userStats.forEach((user) => {
    const role = user.role;
    if (!role) return;
    if (userStatsFormatted[role]) {
      userStatsFormatted[role].count++;
      if (user.isActive) userStatsFormatted[role].active++;
      userStatsFormatted[role].inspections += user._count.inspections;
      userStatsFormatted[role].assignments += user._count.EquipmentOwnership;
      userStatsFormatted[role].conditionsRecorded += user._count.recordedConditions;
    }
  });

  res.status(200).json({
    success: true,
    data: {
      summary: {
        totalOperators,
        totalEquipment,
        assignedEquipment,
        unassignedEquipment,
        totalInspections,
        serviceableEquipment,
        pendingInspections,
      },
      breakdown: {
        usersByRole: usersByRoleFormatted,
        equipmentByequipmentType: equipmentByequipmentTypeFormatted,
        equipmentByCondition: equipmentByConditionFormatted,
      },
      userStats: userStatsFormatted,
      recentInspections,
    },
    timestamp: new Date(),
  });
};