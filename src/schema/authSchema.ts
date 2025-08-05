import * as z from "zod";
import { Role } from "../generated/prisma";
export const signUpSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email:z.string(),
    role: z.enum(Role),
})

export const loginSchema= z.object({
    email:z.string(),
    password: z.string()
})