import * as z from "zod";
import { Status, UserRole } from "../generated/prisma";
import { sanitizeObject } from "../utils/zodHandler";

const status = Object.values(Status);

// ==================== CATEGORY SCHEMAS ====================

/**
 * Schema for creating/updating a category
 */
export const inspectionCategorySchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
});

/**
 * Schema for creating/updating a subcategory
 */
export const subCategoryInspectionSchema = z.object({
  categoryId: z.string(),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long')
});

/**
 * Schema for query parameters when getting categories
 */
export const getCategoriesQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  search: z.string().optional()
});

// ==================== INSPECTION SCHEMAS ====================

/**
 * Schema for individual inspection items
 */
export const InspectionItemSchema = sanitizeObject(z.object({
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().min(1, 'Subcategory is required'),
  recommendation: z.string().optional().nullable(),
  condition: z.enum(status, ({ message: 'Condition must be S, O, A, B, or C' }) 
),
  notes: z.string().optional().nullable(),
}));

/**
 * Schema for creating an inspection
 */
export const CreateInspectionSchema = sanitizeObject(z.object({
  equipmentId: z.string().uuid('Invalid equipment ID'),
  generalNotes: z.string().optional().nullable(),
  overallCondition: z.enum(status,  
    ({ message: 'Overall condition must be S, O, A, B, or C' }) 
  ),
  items: z.array(InspectionItemSchema).min(1, 'At least one inspection item is required')
}));



/**
 * @openapi
 * components:
 *   schemas:
 *     InspectionCategory:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         subCategories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SubCategory'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     SubCategory:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         categoryId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     CreateCategory:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           description: Category title
 *
 *     CreateSubCategory:
 *       type: object
 *       required:
 *         - categoryId
 *         - title
 *       properties:
 *         categoryId:
 *           type: string
 *           description: ID of the parent category
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           description: Subcategory title
 */