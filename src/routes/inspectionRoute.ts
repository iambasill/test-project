import  express  from "express";
import upload  from '../services/multerService';
import { createInspection, getAllInspection, getAllInspectionByEquipmentId,  } from "../controller/inspectionController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { INSPECTION_FIELDS } from "../validator/uploadsValidator";
import { requireIdempotencyKey } from "../middlewares/idempotencyKeyMiddleware";
import { requireManagers } from "../middlewares/rbacMiddleware";

export const inspectionRouter = express.Router();
/**
 * @openapi
 * /inspection:
 *   post:
 *     tags:
 *       - Inspection
 *     summary: Create a new inspection
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: JSON string for inspection data
 *                 example: '{"equipmentId":"123","overallCondition":"S","items":[{"category":"Engine","subCategory":"Oil","condition":"Good"}]}'
 *               inspectionImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               item_0_images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               item_1_images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               item_2_images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               item_3_images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               item_4_images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Inspection created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Inspection created successfully
 *               data:
 *                 id: "ins_001"
 *                 equipmentId: "eq_001"
 *                 datePerformed: "2025-01-01"
 */


/**
 * @openapi
 * /inspection/equipment/{id}:
 *   get:
 *     tags:
 *       - Inspection
 *     summary: Get all inspections for a specific equipment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: sortBy
 *         in: query
 *         schema:
 *           type: string
 *           default: createdAt
 *       - name: sortOrder
 *         in: query
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *       - name: condition
 *         in: query
 *         schema:
 *           type: string
 *           enum: [S, B]
 *       - name: startDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of inspections
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Inspections retrieved
 *               data: []
 *               pagination:
 *                 currentPage: 1
 *                 totalPages: 2
 *                 totalCount: 14
 *                 limit: 10
 */


/**
 * @openapi
 * /inspection:
 *   get:
 *     tags:
 *       - Inspection
 *     summary: Get all inspections
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *       - name: sortBy
 *         in: query
 *         schema:
 *           type: string
 *       - name: sortOrder
 *         in: query
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - name: condition
 *         in: query
 *         schema:
 *           type: string
 *           enum: [S, B]
 *       - name: startDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: All inspections returned
 */
inspectionRouter.get('/equipment/:id', authMiddleware, getAllInspectionByEquipmentId);
inspectionRouter.get('/', authMiddleware, requireManagers, getAllInspection);

// inspectionRouter.delete('/:id',authMiddleware,requirePlatformAdmin,deleteInspection)



