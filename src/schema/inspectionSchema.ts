
import * as z from "zod";
import { Status, UserRole } from "../generated/prisma";
import { sanitizeObject } from "../utils/zodHandler";

const status = Object.values(Status)

// Schema for individual inspection items
export const InspectionItemSchema = sanitizeObject(z.object({
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string(),
  recommendation: z.string().optional().nullable(),
  condition: z.string(),
  notes: z.string().optional().nullable(),
}));

// Schema for creating an inspection
export const CreateInspectionSchema = sanitizeObject(z.object({
  equipmentId: z.string(),
  generalNotes: z.string().optional().nullable(),
  overallCondition: z.enum(status),
  nextDueDate: z.string().optional(),
  items: z.array(InspectionItemSchema).min(1, 'At least one inspection item is required')
}));

export const inspectionCategorySchema = sanitizeObject(z.object({
  title: z.string(),
  subcategories: z.json()
}));

/**
 * @openapi
 * components:
 *   schemas:
 *     InspectionItem:
 *       type: object
 *       required:
 *         - category
 *         - subCategory
 *         - condition
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the inspection item
 *         category:
 *           type: string
 *           description: Category of the inspection item
 *         subCategory:
 *           type: string
 *           description: Subcategory of the inspection item
 *         recommendation:
 *           type: string
 *           nullable: true
 *           description: Recommendation for the item
 *         condition:
 *           type: string
 *           description: Condition of the item
 *         notes:
 *           type: string
 *           nullable: true
 *           description: Optional notes about the item
 *         images:
 *           type: array
 *           description: URLs of images for this inspection item
 *           items:
 *             type: string
 *
 *     Inspection:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the inspection
 *         equipmentId:
 *           type: string
 *           description: ID of the equipment being inspected
 *         generalNotes:
 *           type: string
 *           nullable: true
 *           description: General notes for the inspection
 *         overallCondition:
 *           type: string
 *           description: Overall condition of the equipment
 *           enum: ["S","O","A","B","C"]
 *          nextDueDate:
 *           type:string
 *         items:
 *           type: array
 *           description: List of individual inspection items
 *           items:
 *             $ref: '#/components/schemas/InspectionItem'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the inspection was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the inspection was last updated
 *
 *     CreateInspection:
 *       type: object
 *       required:
 *         - equipmentId
 *         - overallCondition
 *         - items
 *       properties:
 *         equipmentId:
 *           type: string
 *           description: ID of the equipment being inspected
 *         generalNotes:
 *           type: string
 *           nullable: true
 *           description: Optional general notes for the inspection
 *         overallCondition:
 *           type: string
 *           description: Overall condition of the equipment
 *           enum: ["S","O","A","B","C"]
 *         items:
 *           type: string
 *           description: JSON stringified array of inspection items
 *           example: '[{"category":"Engine","subCategory":"Oil Filter","condition":"Good"}]'
 */