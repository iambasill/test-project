// ============================================
// authSchema.ts
// ============================================
import * as z from "zod";
import { Status, UserRole } from "../generated/prisma";
import { sanitizeObject } from "../utils/zodHandler";

const status = Object.values(Status);

/**
 * @openapi
 * components:
 *   schemas:
 *     SignUpSchema:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - role
 *       properties:
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         role:
 *           type: string
 *           enum: [PLATFORM_ADMIN, ORG_ADMIN, ORG_USER, OPERATOR]
 *           example: ORG_USER
 */
export const signUpSchema = sanitizeObject(z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    role: z.enum(UserRole),
}));

/**
 * @openapi
 * components:
 *   schemas:
 *     LoginSchema:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: SecurePassword123!
 */
export const loginSchema = sanitizeObject(z.object({
    email: z.string(),
    password: z.string()
}));

/**
 * @openapi
 * components:
 *   schemas:
 *     EmailSchema:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 */
export const emailSchema = sanitizeObject(z.object({
    email: z.string()
}));

/**
 * @openapi
 * components:
 *   schemas:
 *     UserIdSchema:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440000
 */
export const userIdSchema = sanitizeObject(z.object({
    userId: z.string()
}));

/**
 * @openapi
 * components:
 *   schemas:
 *     ResetPasswordSchema:
 *       type: object
 *       required:
 *         - token
 *         - newPassword
 *       properties:
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         newPassword:
 *           type: string
 *           format: password
 *           minLength: 8
 *           example: NewSecurePassword123!
 */
export const resetPasswordSchema = sanitizeObject(z.object({
    token: z.string(),
    newPassword: z.string()
}));

/**
 * @openapi
 * components:
 *   schemas:
 *     ChangePasswordSchema:
 *       type: object
 *       required:
 *         - email
 *         - newPassword
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         newPassword:
 *           type: string
 *           format: password
 *           minLength: 8
 *           example: NewSecurePassword123!
 */
export const changePasswordSchema = sanitizeObject(z.object({
    email: z.string(),
    newPassword: z.string()
}));

/**
 * @openapi
 * components:
 *   schemas:
 *     QuerySchema:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           example: 1
 *         limit:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *           example: 10
 *         equipmentChasisNumber:
 *           type: string
 *           example: CH123456
 *         operatorId:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         isCurrent:
 *           type: boolean
 *           example: true
 */
export const QuerySchema = sanitizeObject(z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).optional().default(1),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional().default(10),
  equipmentChasisNumber: z.string().optional(),
  operatorId: z.string().uuid().optional(),
  isCurrent: z.string().transform(val => val === 'true').pipe(z.boolean()).optional(),
}));

/**
 * @openapi
 * components:
 *   schemas:
 *     TokenSchema:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
export const tokenSchema = sanitizeObject(z.object({
    refreshToken: z.string()
}));

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Enter your JWT token in the format **Bearer &lt;token&gt;**
 */