import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { unAuthorizedError } from '../httpClass/exceptions';

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