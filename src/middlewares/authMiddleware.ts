import { Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { NextFunction } from "express";
import { AUTH_JWT_TOKEN } from "../../secrets";
import { unAuthorizedError } from "../httpClass/exceptions";
import { checkUser } from "../utils/func";

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
    if (!token || token == null) throw new unAuthorizedError("INVALID TOKEN");
    if (!process.env.AUTH_JWT_TOKEN) throw new unAuthorizedError('JSON WEB TOKEN UNDEFINED!');
    
    const decoded = jwt.verify(token, AUTH_JWT_TOKEN as string) as JwtPayload;
    if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
        throw new unAuthorizedError("INVALID TOKEN PAYLOAD");
    }
    const user:any = await checkUser((decoded as any).id)
    if (!user || user.role !== "ACTIVE" || user.isActive === false) throw new unAuthorizedError("Access Denied")
    req.user = user
    req.token = token
    next();
}