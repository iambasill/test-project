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

// Export types for TypeScript
export type InspectionCategoryInput = z.infer<typeof inspectionCategorySchema>;
export type SubCategoryInput = z.infer<typeof subCategoryInspectionSchema>;
export type GetCategoriesQuery = z.infer<typeof getCategoriesQuerySchema>;
export type InspectionItemInput = z.infer<typeof InspectionItemSchema>;
export type CreateInspectionInput = z.infer<typeof CreateInspectionSchema>;