import { authMiddleware } from '../middlewares/authMiddleware';
import express from "express";
import { requireAuditors } from '../middlewares/rbacMiddleware';
import { getDashboardStats } from '../controller/dashboardController';

export const dashboardRouter = express.Router();

// Base routes
dashboardRouter.get('/stats', authMiddleware, requireAuditors, getDashboardStats);

/**
 * @openapi
 * tags:
 *   name: Dashboard
 *   description: Dashboard statistics and analytics endpoints
 */

/**
 * @openapi
 * /dashboard/stats:
 *   get:
 *     summary: Get comprehensive dashboard statistics
 *     description: |
 *       Retrieves comprehensive dashboard statistics including:
 *       - Summary metrics (operators, equipment, inspections)
 *       - Breakdown by roles, equipment types, and conditions
 *       - User activity statistics
 *       - Recent inspections
 *       
 *       **Required Roles:** PLATADMIN, ADMIN, AUDITOR
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     summary:
 *                       type: object
 *                       description: High-level summary statistics
 *                       properties:
 *                         totalOperators:
 *                           type: integer
 *                           description: Total number of operators in the system
 *                           example: 150
 *                         totalEquipment:
 *                           type: integer
 *                           description: Total number of equipment items
 *                           example: 200
 *                         assignedEquipment:
 *                           type: integer
 *                           description: Number of equipment currently assigned to operators
 *                           example: 180
 *                         unassignedEquipment:
 *                           type: integer
 *                           description: Number of equipment not currently assigned
 *                           example: 20
 *                         totalInspections:
 *                           type: integer
 *                           description: Total number of inspections performed
 *                           example: 450
 *                         serviceableEquipment:
 *                           type: integer
 *                           description: Number of equipment in serviceable condition (S)
 *                           example: 170
 *                         pendingInspections:
 *                           type: integer
 *                           description: Number of inspections not performed in last 30 days
 *                           example: 25
 *                     breakdown:
 *                       type: object
 *                       description: Detailed breakdowns by categories
 *                       properties:
 *                         usersByRole:
 *                           type: object
 *                           description: Number of users grouped by role
 *                           additionalProperties:
 *                             type: integer
 *                           example:
 *                             PLATADMIN: 2
 *                             ADMIN: 5
 *                             AUDITOR: 8
 *                             MANAGER: 15
 *                             OFFICER: 30
 *                         equipmentByequipmentType:
 *                           type: array
 *                           description: Equipment count grouped by type
 *                           items:
 *                             type: object
 *                             properties:
 *                               type:
 *                                 type: string
 *                                 nullable: true
 *                                 example: Truck
 *                               count:
 *                                 type: integer
 *                                 example: 50
 *                         equipmentByCondition:
 *                           type: object
 *                           description: Equipment count grouped by condition
 *                           additionalProperties:
 *                             type: integer
 *                           example:
 *                             S: 170
 *                             O: 15
 *                             A: 10
 *                             B: 3
 *                             C: 2
 *                     userStats:
 *                       type: object
 *                       description: Detailed statistics for each user role
 *                       properties:
 *                         OFFICER:
 *                           $ref: '#/components/schemas/RoleStats'
 *                         ADMIN:
 *                           $ref: '#/components/schemas/RoleStats'
 *                         AUDITOR:
 *                           $ref: '#/components/schemas/RoleStats'
 *                         MANAGER:
 *                           $ref: '#/components/schemas/RoleStats'
 *                         PLATADMIN:
 *                           $ref: '#/components/schemas/RoleStats'
 *                     recentInspections:
 *                       type: array
 *                       description: List of recent inspections (last 7 days)
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           datePerformed:
 *                             type: string
 *                             format: date-time
 *                           overallCondition:
 *                             type: string
 *                             enum: [S, O, A, B, C]
 *                           equipment:
 *                             type: object
 *                             properties:
 *                               equipmentName:
 *                                 type: string
 *                               chasisNumber:
 *                                 type: string
 *                           inspector:
 *                             type: object
 *                             properties:
 *                               firstName:
 *                                 type: string
 *                               lastName:
 *                                 type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the statistics were generated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires PLATADMIN, ADMIN, or AUDITOR role
 *       500:
 *         description: Internal Server Error
 * 
 * components:
 *   schemas:
 *     RoleStats:
 *       type: object
 *       description: Activity statistics for a specific user role
 *       properties:
 *         count:
 *           type: integer
 *           description: Total number of users with this role
 *           example: 30
 *         active:
 *           type: integer
 *           description: Number of active users with this role
 *           example: 28
 *         inspections:
 *           type: integer
 *           description: Total inspections performed by this role
 *           example: 150
 *         assignments:
 *           type: integer
 *           description: Total equipment assignments made by this role
 *           example: 75
 *         conditionsRecorded:
 *           type: integer
 *           description: Total condition records created by this role
 *           example: 200
 */