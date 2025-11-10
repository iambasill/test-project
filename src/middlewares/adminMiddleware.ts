import { Request, Response, NextFunction } from 'express';
import { unAuthorizedError } from '../logger/exceptions';

/**
 * Middleware specifically for Platform Admin actions (highest privilege)
 */
export const requirePlatformAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const user:any = req.user
    if (!user || user.role !== 'PLATADMIN') {
      throw new unAuthorizedError("Platform Admin privileges required");
    }
    next();
};