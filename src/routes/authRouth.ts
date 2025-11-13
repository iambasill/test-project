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
} from '../controller/authController';

import { authMiddleware } from '../middlewares/authMiddleware';
import { requirePlatformAdmin } from '../middlewares/adminMiddleware';

export const authRoute = express();

// Public routes (no authentication required)
authRoute.post('/login', loginController);
authRoute.post('/signup', registerController);
authRoute.post('/verify-user', verifyUserController);
authRoute.post('/reset-password', changePasswordController);
authRoute.post('/forgot-password', forgotPasswordController);
authRoute.post('/resend-verification', resendVerficationController);
authRoute.post('/refresh-token',authMiddleware, refreshToken);


// General authenticated routes
authRoute.post('/verify-session-token', verifySessionTokenController);

authRoute.post('/logout', authMiddleware, logoutController);

// Admin status
authRoute.get('/admin-status',authMiddleware, requirePlatformAdmin, getAdminStatusController);

// Platform admin only routes (emergency override)
authRoute.post('/force-terminate-admin', authMiddleware, requirePlatformAdmin, forceTerminateAdminController);