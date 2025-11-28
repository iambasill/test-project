import * as z from "zod";
import {  Status, UserRole } from "../generated/prisma";
import { sanitizeObject } from "../utils/zodHandler";

const status = Object.values(Status)


export const signUpSchema = sanitizeObject(z.object({
    firstName: z.string(),
    lastName: z.string(),
    email:z.string(),
    role: z.enum(UserRole),
}))

export const loginSchema= sanitizeObject(z.object({
    email:z.string(),
    password: z.string()
}))

export const emailSchema= sanitizeObject(z.object({
    email:z.string()
}))

export const userIdSchema= sanitizeObject(z.object({
    userId:z.string()
}))

export const changePasswordSchema= sanitizeObject(z.object({
    token:z.string(),
    newPassword: z.string()
}))


export const QuerySchema = sanitizeObject(z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).optional().default(1),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional().default(10),
  equipmentChasisNumber: z.string().optional(),
  operatorId: z.string().uuid().optional(),
  isCurrent: z.string().transform(val => val === 'true').pipe(z.boolean()).optional(),
}));



export const tokenSchema= sanitizeObject(z.object({
    refreshToken:z.string()
}))





