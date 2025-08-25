import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { prisma } from '../server';
import { unAuthorizedError } from '../httpClass/exceptions';
import { AUTH_JWT_TOKEN } from '../../secrets';

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