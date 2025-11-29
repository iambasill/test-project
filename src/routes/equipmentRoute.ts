import express from "express";
import upload from "../services/multerService";
import { authMiddleware } from "../middlewares/authMiddleware";
import { UPLOAD_FIELDS } from "../schema/uploadsSchema";
import {
  createEquipment,
  createEquipmentOwnership,
  getEquipmentController,
  getEquipmentById,
  updateEquipment,
  getEquipmentOwnerships,
  updateEquipmentOwnerships,
  getEquipmentCategories,
  unassignEquipmentOwnership,
} from "../controller/equipmentController";

export const equipmentRouter = express.Router();

// Category route (before :id to avoid conflicts)
equipmentRouter.get("/category", authMiddleware, getEquipmentCategories);

// Base equipment routes
equipmentRouter.get("/", authMiddleware, getEquipmentController);
equipmentRouter.post("/", authMiddleware, upload.fields(UPLOAD_FIELDS), createEquipment);

// Ownership routes
equipmentRouter.get("/ownership/:id", authMiddleware, getEquipmentOwnerships);
equipmentRouter.post("/ownership", authMiddleware, upload.any(UPLOAD_FIELDS), createEquipmentOwnership);
equipmentRouter.delete("/:equipmentId/unassign/:operatorId", authMiddleware, unassignEquipmentOwnership);
equipmentRouter.put("/ownership/:ownershipId", authMiddleware, upload.any(UPLOAD_FIELDS), updateEquipmentOwnerships);

// Specific equipment routes (must be last to avoid conflicts with /category and /ownership)
equipmentRouter.get("/:id", authMiddleware, getEquipmentById);
equipmentRouter.put("/:id", authMiddleware, upload.fields(UPLOAD_FIELDS), updateEquipment);

/**
 * @openapi
 * tags:
 *   name: Equipment
 *   description: Equipment management endpoints
 */

/**
 * @openapi
 * /equipment:
 *   get:
 *     summary: Get all equipment with pagination and filters
 *     tags: [Equipment]
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by equipment name, chasis number, or registration
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by equipment category
 *       - in: query
 *         name: condition
 *         schema:
 *           type: string
 *           enum: ["S", "O", "A", "B", "C"]
 *         description: Filter by equipment condition
 *       - in: query
 *         name: vehicleType
 *         schema:
 *           type: string
 *         description: Filter by vehicle type
 *     responses:
 *       200:
 *         description: List of equipment with pagination
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
 *                     $ref: '#/components/schemas/Equipment'
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
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /equipment/{id}:
 *   get:
 *     summary: Get equipment by ID
 *     tags: [Equipment]
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
 *         description: Equipment details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Equipment'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Equipment not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /equipment:
 *   post:
 *     summary: Create new equipment
 *     tags: [Equipment]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateEquipment'
 *     responses:
 *       201:
 *         description: Equipment created successfully
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
 *                   $ref: '#/components/schemas/Equipment'
 *       400:
 *         description: Invalid input or duplicate equipment
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /equipment/{id}:
 *   put:
 *     summary: Update equipment
 *     tags: [Equipment]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Equipment ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateEquipment'
 *     responses:
 *       200:
 *         description: Equipment updated successfully
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
 *                   $ref: '#/components/schemas/Equipment'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Equipment not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /equipment/category:
 *   get:
 *     summary: Get all equipment categories
 *     tags: [Equipment]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of equipment categories
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /equipment/ownership/{id}:
 *   get:
 *     summary: Get ownership history for equipment
 *     tags: [Equipment]
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
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *           default: "10"
 *       - in: query
 *         name: isCurrent
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: Filter by current ownership status
 *     responses:
 *       200:
 *         description: Ownership history
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
 *                     $ref: '#/components/schemas/EquipmentOwnership'
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
 *       404:
 *         description: Equipment not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /equipment/ownership:
 *   post:
 *     summary: Create equipment ownership assignment
 *     tags: [Equipment]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateEquipmentOwnership'
 *     responses:
 *       201:
 *         description: Ownership created successfully
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
 *                   $ref: '#/components/schemas/EquipmentOwnership'
 *       400:
 *         description: Invalid input or equipment already assigned
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Equipment or operator not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /equipment/ownership/{ownershipId}:
 *   put:
 *     summary: Update equipment ownership
 *     tags: [Equipment]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ownershipId
 *         required: true
 *         schema:
 *           type: string
 *         description: Ownership record ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               isCurrent:
 *                 type: boolean
 *               primaryDuties:
 *                 type: string
 *               driverLicenseId:
 *                 type: string
 *               coFirstName:
 *                 type: string
 *               coLastName:
 *                 type: string
 *               coEmail:
 *                 type: string
 *                 format: email
 *               coPhoneNumber:
 *                 type: string
 *               conditionAtAssignment:
 *                 type: string
 *                 enum: ["S", "O", "A", "B", "C"]
 *               notes:
 *                 type: string
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Ownership updated successfully
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
 *                   $ref: '#/components/schemas/EquipmentOwnership'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ownership record not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /equipment/{equipmentId}/unassign/{operatorId}:
 *   delete:
 *     summary: Unassign equipment ownership
 *     tags: [Equipment]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Equipment ID
 *       - in: path
 *         name: operatorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Operator ID
 *     responses:
 *       200:
 *         description: Ownership removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */