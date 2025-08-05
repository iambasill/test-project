import { NextFunction, Request, Response } from "express";
import { prisma } from "../server";
import { unAuthorizedError } from "../httpClass/exceptions";



export const adminMiddleware = (req:Request,res:Response,next:NextFunction) => {
    const {userID} = req.body
    const user:any = prisma.user.findUnique({
            where:{id:userID},
        })
    if (!user || user.role != 'ADMIN') throw new unAuthorizedError(user)
    next()

}