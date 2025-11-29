import { authMiddleware } from '../middlewares/authMiddleware';
import express from 'express';
import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  updateUserStatus,
} from '../controller/userController';
import { requireAdmins } from '../middlewares/rbacMiddleware';

export const userRoute = express();

// Base routes - GET with queries/pagination
userRoute.get('/', authMiddleware, requireAdmins, getAllUsers);

// Get user by email (POST to send email in body)
userRoute.post('/by-email', authMiddleware, requireAdmins, getUserByEmail);

// Specific user routes
userRoute.get('/:id', authMiddleware, requireAdmins, getUserById);
userRoute.put('/:id', authMiddleware, requireAdmins, updateUser);
userRoute.put('/:id/status', authMiddleware, requireAdmins, updateUserStatus);

export default userRoute;

/**
 * @openapi
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users with filtering and pagination
 *     description: |
 *       Retrieves a paginated list of all users in the system with advanced filtering and sorting options.
 *       
 *       **Required Roles:** PLATADMIN, ADMIN
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by firstName, lastName, or email
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [PLATADMIN, ADMIN, AUDITOR, MANAGER, OFFICER, OPERATOR]
 *         description: Filter by user role
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, SUSPENDED, PENDING]
 *         description: Filter by user status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: A paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires PLATADMIN or ADMIN role
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /users/by-email:
 *   post:
 *     summary: Get user by email address
 *     description: |
 *       Retrieves a user's information by their email address.
 *       
 *       **Required Roles:** PLATADMIN, ADMIN
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailSchema'
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid email or user not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires PLATADMIN or ADMIN role
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: |
 *       Retrieves detailed information about a specific user by their ID.
 *       
 *       **Required Roles:** PLATADMIN, ADMIN
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires PLATADMIN or ADMIN role
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Update user information
 *     description: |
 *       Updates user details such as name, email, and role. Platform Admins can update any user, while Admins can update users below their level.
 *       
 *       **Required Roles:** PLATADMIN, ADMIN
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               role:
 *                 type: string
 *                 enum: [PLATADMIN, ADMIN, AUDITOR, MANAGER, OFFICER, OPERATOR]
 *                 example: MANAGER
 *               phoneNumber:
 *                 type: string
 *                 nullable: true
 *                 example: "+1234567890"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input or duplicate email
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires PLATADMIN or ADMIN role
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /users/{id}/status:
 *   put:
 *     summary: Update user status
 *     description: |
 *       Updates a user's account status (ACTIVE, INACTIVE, SUSPENDED, PENDING).
 *       
 *       **Required Roles:** PLATADMIN, ADMIN
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, SUSPENDED, PENDING]
 *                 description: New status for the user
 *                 example: ACTIVE
 *               reason:
 *                 type: string
 *                 nullable: true
 *                 description: Optional reason for status change
 *                 example: Account verification completed
 *     responses:
 *       200:
 *         description: User status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid status value
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires PLATADMIN or ADMIN role
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */