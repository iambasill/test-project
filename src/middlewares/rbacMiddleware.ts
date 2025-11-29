import { Request, Response, NextFunction } from 'express';
import { unAuthorizedError } from '../logger/exceptions';
import { User } from '../generated/prisma';

/**
 * Middleware to check if user has one of the required roles
 * @param allowedRoles - Array of roles that are allowed to access the route
 */
export const requireRoles = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    
    if (!user || !user.role) {
      throw new unAuthorizedError("Unauthorized user");
    }
    
    if (!allowedRoles.includes(user.role)) {
      throw new unAuthorizedError("Access denied.");
    }
    
    next();
  };
};

/**
 * Middleware specifically for Platform Admin actions (highest privilege)
 */
export const requirePlatformAdmin = requireRoles(['PLATADMIN']);
export const requireAdmins = requireRoles(['PLATADMIN', 'ADMIN']);
export const requireAuditors = requireRoles(['PLATADMIN',  'ADMIN',  'AUDITOR', ]);
export const requireManagers = requireRoles(['PLATADMIN', 'ADMIN','AUDITOR', 'MANAGER']);
export const requireOfficers = requireRoles(['PLATADMIN', 'ADMIN', 'AUDITOR', 'OFFICER']);

