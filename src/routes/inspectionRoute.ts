import express from "express";
import upload from '../services/multerService';
import { createInspection, getAllInspection, getAllInspectionByEquipmentId } from "../controller/inspectionController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { INSPECTION_FIELDS } from "../schema/uploadsSchema";
import { requireIdempotencyKey } from "../middlewares/idempotencyKeyMiddleware";
import { requireManagers, requireOfficers } from "../middlewares/rbacMiddleware";
import { categoryRouter } from "./inspectionCategoryRoute";

export const inspectionRouter = express.Router();

inspectionRouter.use('/category', categoryRouter);
inspectionRouter.get('/equipment/:id', authMiddleware, requireOfficers, getAllInspectionByEquipmentId);
inspectionRouter.get('/', authMiddleware, requireOfficers, getAllInspection);
inspectionRouter.post('/', authMiddleware, requireOfficers, requireIdempotencyKey, upload.fields(INSPECTION_FIELDS), createInspection);
// inspectionRouter.delete('/:id', authMiddleware, requirePlatformAdmin, deleteInspection)

/**
 * @openapi
 * tags:
 *   name: Inspections
 *   description: Inspection management endpoints
 */

/**
 * @openapi
 * /inspections:
 *   get:
 *     summary: Get all inspections
 *     description: |
 *       Retrieves a list of all inspections with pagination and filtering options.
 *       
 *       **Required Roles:** PLATADMIN, ADMIN, AUDITOR, OFFICER
 *     tags: [Inspections]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *           default: "1"
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *           default: "10"
 *         description: Items per page
 *       - in: query
 *         name: equipmentId
 *         schema:
 *           type: string
 *         description: Filter by equipment ID
 *       - in: query
 *         name: condition
 *         schema:
 *           type: string
 *           enum: ["S", "O", "A", "B", "C"]
 *         description: Filter by overall condition
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter inspections from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter inspections up to this date
 *     responses:
 *       200:
 *         description: A list of inspections
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Inspection'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     page:
 *                       type: number
 *                     limit:
 *                       type: number
 *                     totalPages:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires PLATADMIN, ADMIN, AUDITOR, or OFFICER role
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /inspections/equipment/{id}:
 *   get:
 *     summary: Get inspections for a specific equipment
 *     description: |
 *       Retrieves all inspections associated with a specific equipment.
 *       
 *       **Required Roles:** PLATADMIN, ADMIN, AUDITOR, OFFICER
 *     tags: [Inspections]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Equipment ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *           default: "1"
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *           default: "10"
 *         description: Items per page
 *       - in: query
 *         name: condition
 *         schema:
 *           type: string
 *           enum: ["S", "O", "A", "B", "C"]
 *         description: Filter by overall condition
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter inspections from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter inspections up to this date
 *     responses:
 *       200:
 *         description: A list of inspections for this equipment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Inspection'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     page:
 *                       type: number
 *                     limit:
 *                       type: number
 *                     totalPages:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires PLATADMIN, ADMIN, AUDITOR, or OFFICER role
 *       404:
 *         description: Equipment not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /inspections:
 *   post:
 *     summary: Create a new inspection
 *     description: |
 *       Creates a new equipment inspection with multiple inspection items and images.
 *       
 *       **Required Roles:** PLATADMIN, ADMIN, AUDITOR, OFFICER
 *       
 *       **Note:** This endpoint requires an Idempotency-Key header to prevent duplicate submissions.
 *     tags: [Inspections]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Idempotency-Key
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier to prevent duplicate requests
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - equipmentId
 *               - overallCondition
 *               - items
 *             properties:
 *               equipmentId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the equipment being inspected
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *               generalNotes:
 *                 type: string
 *                 nullable: true
 *                 description: Optional general notes for the inspection
 *                 example: Regular monthly inspection completed
 *               overallCondition:
 *                 type: string
 *                 description: Overall condition of the equipment
 *                 enum: ["S", "O", "A", "B", "C"]
 *                 example: A
 *               items:
 *                 type: string
 *                 description: |
 *                   JSON stringified array of inspection items. Each item should contain:
 *                   - category: Category ID or name
 *                   - subCategory: Subcategory ID or name
 *                   - condition: Item condition (S/O/A/B/C)
 *                   - notes: Optional notes about this item
 *                   - recommendation: Optional recommendation for this item
 *                 example: '[{"category":"engine-123","subCategory":"oil-filter-456","condition":"A","notes":"Clean and functional","recommendation":"Replace within 3 months"}]'
 *               images:
 *                 type: array
 *                 description: Images for inspection items (max 4 files per item)
 *                 items:
 *                   type: string
 *                   format: binary
 *           encoding:
 *             items:
 *               contentType: application/json
 *     responses:
 *       201:
 *         description: Inspection created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Inspection'
 *       400:
 *         description: Invalid input or duplicate inspection
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires PLATADMIN, ADMIN, AUDITOR, or OFFICER role
 *       404:
 *         description: Equipment not found
 *       500:
 *         description: Internal Server Error
 */