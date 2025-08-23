import express from 'express';
import { 
  loginController, 
  registerController, 
  changePasswordController, 
  verifyTokenController, 
  verifyUserController,
  logoutController,
  getAdminStatusController,
  forceTerminateAdminController,
  forgotPasswordController,
  resendVerficationController,
} from '../controller/authController';

import { authMiddleware } from '../middlewares/authMiddleware';
import { requirePlatformAdmin } from '../middlewares/adminMiddleware';

export const authRoute = express();

// Public routes (no authentication required)
authRoute.post('/login', loginController);
authRoute.post('/signup', registerController);
authRoute.post('/verify-user', verifyUserController);
authRoute.post('/change-password', changePasswordController);
authRoute.post('/forgot-password', forgotPasswordController);
authRoute.post('/resend-verification', resendVerficationController);



// General authenticated routes
authRoute.post('/verify-token', authMiddleware, verifyTokenController);

authRoute.post('/logout', authMiddleware, logoutController);

// Admin status
authRoute.get('/admin-status', requirePlatformAdmin, getAdminStatusController);

// Platform admin only routes (emergency override)
authRoute.post('/force-terminate-admin', requirePlatformAdmin, forceTerminateAdminController);