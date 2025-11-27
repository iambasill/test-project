import express from "express";
import upload from '../services/multerService';
import { createInspection, getAllInspection, getAllInspectionByEquipmentId } from "../controller/inspectionController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { INSPECTION_FIELDS } from "../schema/uploadsSchema";
import { requireIdempotencyKey } from "../middlewares/idempotencyKeyMiddleware";
import { requireManagers } from "../middlewares/rbacMiddleware";
import { categoryRouter } from "./inspectionCategoryRoute";

export const inspectionRouter = express.Router();

inspectionRouter.use('/category', categoryRouter)
inspectionRouter.get('/equipment/:id', authMiddleware, getAllInspectionByEquipmentId);
inspectionRouter.get('/', authMiddleware, requireManagers, getAllInspection);
inspectionRouter.post('/', authMiddleware, requireIdempotencyKey, upload.fields(INSPECTION_FIELDS), createInspection);
// inspectionRouter.delete('/:id',authMiddleware,requirePlatformAdmin,deleteInspection)

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
 *     tags: [Inspections]
 *     security:
 *       - BearerAuth: []
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /inspections/equipment/{id}:
 *   get:
 *     summary: Get inspections for a specific equipment
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /inspections:
 *   post:
 *     summary: Create a new inspection
 *     tags: [Inspections]
 *     security:
 *       - BearerAuth: []
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
 *                 description: ID of the equipment being inspected
 *               generalNotes:
 *                 type: string
 *                 nullable: true
 *                 description: Optional general notes for the inspection
 *               overallCondition:
 *                 type: string
 *                 description: Overall condition of the equipment
 *                 enum: ["S","O","A","B","C"]
 *               items:
 *                 type: string
 *                 description: JSON stringified array of inspection items. Each item should contain category, subCategory, condition, and optional notes/recommendation.
 *                 example: '[{"category":"Engine","subCategory":"Oil Filter","condition":"Good","notes":"Clean and functional","recommendation":null}]'
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
 *                 data:
 *                   $ref: '#/components/schemas/Inspection'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */
