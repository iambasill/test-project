import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import upload from "../services/multerService";
import { OPERATOR_FIELDS } from "../schema/uploadsSchema";
import {
  createOperator,
  deleteOperator,
  getOperators,
  getOperatorById,
  updateOperator,
  getOperatorEquipmentHistory,
} from "../controller/operatorController";
import { requireManagers } from "../middlewares/rbacMiddleware";

export const operatorRouter = express.Router();

// Base routes - GET with queries/pagination
operatorRouter.get("/", authMiddleware, requireManagers, getOperators);
operatorRouter.post("/", authMiddleware, requireManagers, upload.fields(OPERATOR_FIELDS), createOperator);

// Equipment history for specific operator (must be before /:id to avoid route conflicts)
operatorRouter.get("/:id/equipment-history", requireManagers, authMiddleware, getOperatorEquipmentHistory);

// Specific operator routes
operatorRouter.get("/:id", authMiddleware,requireManagers, getOperatorById);
operatorRouter.put("/:id", authMiddleware, requireManagers,upload.fields(OPERATOR_FIELDS), updateOperator);
// operatorRouter.delete("/:id", authMiddleware, deleteOperator);

/**
 * @openapi
 * tags:
 *   name: Operators
 *   description: Operator management endpoints
 */

/**
 * @openapi
 * /operators:
 *   get:
 *     summary: Get all operators with filtering and pagination
 *     tags: [Operators]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by firstName, lastName, serviceNumber, email, or officialEmailAddress
 *       - in: query
 *         name: rank
 *         schema:
 *           type: string
 *         description: Filter by rank
 *       - in: query
 *         name: branch
 *         schema:
 *           type: string
 *         description: Filter by branch
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *         description: Filter by position
 *       - in: query
 *         name: hasEquipment
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: Filter operators with/without current equipment
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: A paginated list of operators
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
 *                     $ref: '#/components/schemas/Operator'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /operators:
 *   post:
 *     summary: Create a new operator
 *     tags: [Operators]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Operator's email address
 *               firstName:
 *                 type: string
 *                 description: Operator's first name
 *               lastName:
 *                 type: string
 *                 description: Operator's last name
 *               serviceNumber:
 *                 type: string
 *                 description: Unique service number
 *               rank:
 *                 type: string
 *                 description: Military rank
 *               branch:
 *                 type: string
 *                 nullable: true
 *                 description: Military branch
 *               position:
 *                 type: string
 *                 nullable: true
 *                 description: Current position
 *               identificationType:
 *                 type: string
 *                 nullable: true
 *                 description: Type of identification
 *               officialEmailAddress:
 *                 type: string
 *                 format: email
 *                 nullable: true
 *                 description: Official email address
 *               phoneNumber:
 *                 type: string
 *                 nullable: true
 *                 description: Primary phone number
 *               alternatePhoneNumber1:
 *                 type: string
 *                 nullable: true
 *                 description: First alternate phone number
 *               alternatePhoneNumber2:
 *                 type: string
 *                 nullable: true
 *                 description: Second alternate phone number
 *               alternatePhoneNumber3:
 *                 type: string
 *                 nullable: true
 *                 description: Third alternate phone number
 *               item_1_images:
 *                 type: array
 *                 description: Document images (max 5 files)
 *                 items:
 *                   type: string
 *                   format: binary
 *               item_2_images:
 *                 type: array
 *                 description: Document images (max 5 files)
 *                 items:
 *                   type: string
 *                   format: binary
 *               item_3_images:
 *                 type: array
 *                 description: Document images (max 5 files)
 *                 items:
 *                   type: string
 *                   format: binary
 *               item_4_images:
 *                 type: array
 *                 description: Document images (max 5 files)
 *                 items:
 *                   type: string
 *                   format: binary
 *               item_5_images:
 *                 type: array
 *                 description: Document images (max 5 files)
 *                 items:
 *                   type: string
 *                   format: binary
 *               item_6_images:
 *                 type: array
 *                 description: Document images (max 5 files)
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Operator created successfully
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
 *                   $ref: '#/components/schemas/Operator'
 *                 isNew:
 *                   type: boolean
 *       400:
 *         description: Bad Request - Duplicate service number or email
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /operators/{id}:
 *   get:
 *     summary: Get operator by ID
 *     tags: [Operators]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Operator ID
 *     responses:
 *       200:
 *         description: Operator details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 operator:
 *                   $ref: '#/components/schemas/OperatorDetail'
 *       400:
 *         description: Operator not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /operators/{id}:
 *   put:
 *     summary: Update operator
 *     tags: [Operators]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Operator ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               serviceNumber:
 *                 type: string
 *               rank:
 *                 type: string
 *               branch:
 *                 type: string
 *                 nullable: true
 *               position:
 *                 type: string
 *                 nullable: true
 *               identificationType:
 *                 type: string
 *                 nullable: true
 *               officialEmailAddress:
 *                 type: string
 *                 format: email
 *                 nullable: true
 *               phoneNumber:
 *                 type: string
 *                 nullable: true
 *               alternatePhoneNumber1:
 *                 type: string
 *                 nullable: true
 *               alternatePhoneNumber2:
 *                 type: string
 *                 nullable: true
 *               alternatePhoneNumber3:
 *                 type: string
 *                 nullable: true
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
 *               item_5_images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               item_6_images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Operator updated successfully
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
 *                   $ref: '#/components/schemas/Operator'
 *       400:
 *         description: Bad Request - Operator not found or duplicate data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /operators/{id}/equipment-history:
 *   get:
 *     summary: Get equipment history for an operator
 *     tags: [Operators]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Operator ID
 *     responses:
 *       200:
 *         description: Equipment assignment history
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
 *       400:
 *         description: Operator not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */