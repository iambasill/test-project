import * as z from "zod";
import { Role } from "../generated/prisma";
export const signUpSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email:z.email(),
    role: z.enum(Role),
    password: z.string()
})

export const loginSchema= z.object({
    email:z.email(),
    password: z.string()
})