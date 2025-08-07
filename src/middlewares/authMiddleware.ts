import { Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { NextFunction } from "express";
import { AUTH_JWT_TOKEN } from "../../secrets";
import { unAuthorizedError } from "../httpClass/exceptions";

// Extend the Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: { userID: string };
        }
    }
}

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token || token == null) throw new unAuthorizedError("INVALID TOKEN");
    if (!process.env.AUTH_JWT_TOKEN) throw new unAuthorizedError('JSON WEB TOKEN UNDEFINED!');
    
    const decoded = jwt.verify(token, AUTH_JWT_TOKEN as string) as JwtPayload;
    if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
        throw new unAuthorizedError("INVALID TOKEN PAYLOAD");
    }
    
    req.user = (decoded as any).id 
    next();
}