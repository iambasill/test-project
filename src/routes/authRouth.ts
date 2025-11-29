// ============================================
// authRoute.ts
// ============================================
import express from 'express';
import { 
  loginController, 
  registerController, 
  changePasswordController, 
  verifySessionTokenController, 
  verifyUserController,
  logoutController,
  getAdminStatusController,
  forceTerminateAdminController,
  forgotPasswordController,
  resendVerficationController,
  refreshToken,
  resetPasswordController,
} from '../controller/authController';

import { authMiddleware } from '../middlewares/authMiddleware';
import { requirePlatformAdmin } from '../middlewares/rbacMiddleware';

export const authRoute = express();

// Public routes (no authentication required)
authRoute.post('/login', loginController);
authRoute.post('/signup', registerController);
authRoute.post('/verify-user', verifyUserController);
authRoute.post('/check-user', verifyUserController);
authRoute.post('/reset-password', resetPasswordController);
authRoute.post('/change-password', resetPasswordController);
authRoute.post('/forgot-password', forgotPasswordController);
authRoute.post('/resend-verification', resendVerficationController);
authRoute.post('/refresh-token', authMiddleware, refreshToken);

// General authenticated routes
authRoute.post('/verify-session-token', verifySessionTokenController);
authRoute.post('/logout', authMiddleware, logoutController);

// Admin status
authRoute.get('/admin-status', authMiddleware, requirePlatformAdmin, getAdminStatusController);

// Platform admin only routes (emergency override)
authRoute.post('/force-terminate-admin', authMiddleware, requirePlatformAdmin, forceTerminateAdminController);

/**
 * @openapi
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization endpoints
 */

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginSchema'
 *     responses:
 *       200:
 *         description: Login successful
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
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     summary: Register new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpSchema'
 *     responses:
 *       201:
 *         description: User registered successfully
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
 *                   type: object
 *       400:
 *         description: Invalid input or user already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /auth/verify-user:
 *   post:
 *     summary: Verify user email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserIdSchema'
 *     responses:
 *       200:
 *         description: User verified successfully
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /auth/check-user:
 *   post:
 *     summary: Check if user exists
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserIdSchema'
 *     responses:
 *       200:
 *         description: User check completed
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     summary: Reset password with token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordSchema'
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordSchema'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailSchema'
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /auth/resend-verification:
 *   post:
 *     summary: Resend verification email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailSchema'
 *     responses:
 *       200:
 *         description: Verification email sent
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TokenSchema'
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       401:
 *         description: Invalid or expired refresh token
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /auth/verify-session-token:
 *   post:
 *     summary: Verify session token validity
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Invalid or expired token
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /auth/admin-status:
 *   get:
 *     summary: Get admin status (Platform Admin only)
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Admin status retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Platform Admin access required
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /auth/force-terminate-admin:
 *   post:
 *     summary: Force terminate admin session (Platform Admin only)
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Admin session terminated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Platform Admin access required
 *       500:
 *         description: Internal server error
 */