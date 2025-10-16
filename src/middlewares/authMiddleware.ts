import { Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { NextFunction } from "express";
import { unAuthorizedError } from "../httpClass/exceptions";
import { checkUser, verifyToken } from "../utils/helperFunction";

// Extend the Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: object
            token?: string
        }
    }
}


export const authMiddleware = async(req: Request, _res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token || token == null) throw new unAuthorizedError("INVALID TOKEN OR EXPIRED TOKEN");

    const decoded:jwt.JwtPayload = await verifyToken(token,"auth")
    if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) throw new unAuthorizedError("INVALID OR EXPIRED TOKEN");

    const {user}:any = await checkUser((decoded as any).id)
    if (!user || user.status?.toUpperCase() !== "ACTIVE") throw new unAuthorizedError("Access Denied")
    req.user = user
    req.token = token
    next();
}