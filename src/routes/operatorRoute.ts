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
operatorRouter.get("/:id/equipment-history", authMiddleware, requireManagers, getOperatorEquipmentHistory);

// Specific operator routes
operatorRouter.get("/:id", authMiddleware, requireManagers, getOperatorById);
operatorRouter.put("/:id", authMiddleware, requireManagers, upload.fields(OPERATOR_FIELDS), updateOperator);
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
 *     description: |
 *       Retrieves a paginated list of operators with advanced filtering and sorting options.
 *       
 *       **Required Roles:** PLATADMIN, ADMIN, AUDITOR, MANAGER
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
 *       403:
 *         description: Forbidden - Requires PLATADMIN, ADMIN, AUDITOR, or MANAGER role
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /operators:
 *   post:
 *     summary: Create a new operator
 *     description: |
 *       Creates a new operator record with optional document uploads.
 *       
 *       **Required Roles:** PLATADMIN, ADMIN, AUDITOR, MANAGER
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
 *                 example: operator@example.com
 *               firstName:
 *                 type: string
 *                 description: Operator's first name
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: Operator's last name
 *                 example: Doe
 *               serviceNumber:
 *                 type: string
 *                 description: Unique service number
 *                 example: SN123456
 *               rank:
 *                 type: string
 *                 description: Military rank
 *                 example: Captain
 *               branch:
 *                 type: string
 *                 nullable: true
 *                 description: Military branch
 *                 example: Army
 *               position:
 *                 type: string
 *                 nullable: true
 *                 description: Current position
 *                 example: Unit Commander
 *               identificationType:
 *                 type: string
 *                 nullable: true
 *                 description: Type of identification
 *                 example: Military ID
 *               officialEmailAddress:
 *                 type: string
 *                 format: email
 *                 nullable: true
 *                 description: Official email address
 *                 example: john.doe@military.gov
 *               phoneNumber:
 *                 type: string
 *                 nullable: true
 *                 description: Primary phone number
 *                 example: "+1234567890"
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
 *       403:
 *         description: Forbidden - Requires PLATADMIN, ADMIN, AUDITOR, or MANAGER role
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /operators/{id}:
 *   get:
 *     summary: Get operator by ID
 *     description: |
 *       Retrieves detailed information about a specific operator including their current equipment assignments.
 *       
 *       **Required Roles:** PLATADMIN, ADMIN, AUDITOR, MANAGER
 *     tags: [Operators]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Operator ID
 *         example: 550e8400-e29b-41d4-a716-446655440000
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
 *       403:
 *         description: Forbidden - Requires PLATADMIN, ADMIN, AUDITOR, or MANAGER role
 *       404:
 *         description: Operator not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /operators/{id}:
 *   put:
 *     summary: Update operator
 *     description: |
 *       Updates an existing operator record. Can update personal information and documents.
 *       
 *       **Required Roles:** PLATADMIN, ADMIN, AUDITOR, MANAGER
 *     tags: [Operators]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Operator ID
 *         example: 550e8400-e29b-41d4-a716-446655440000
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
 *                 example: operator@example.com
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               serviceNumber:
 *                 type: string
 *                 example: SN123456
 *               rank:
 *                 type: string
 *                 example: Captain
 *               branch:
 *                 type: string
 *                 nullable: true
 *                 example: Army
 *               position:
 *                 type: string
 *                 nullable: true
 *                 example: Unit Commander
 *               identificationType:
 *                 type: string
 *                 nullable: true
 *                 example: Military ID
 *               officialEmailAddress:
 *                 type: string
 *                 format: email
 *                 nullable: true
 *                 example: john.doe@military.gov
 *               phoneNumber:
 *                 type: string
 *                 nullable: true
 *                 example: "+1234567890"
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
 *       403:
 *         description: Forbidden - Requires PLATADMIN, ADMIN, AUDITOR, or MANAGER role
 *       404:
 *         description: Operator not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /operators/{id}/equipment-history:
 *   get:
 *     summary: Get equipment history for an operator
 *     description: |
 *       Retrieves the complete equipment assignment history for a specific operator, including current and past assignments.
 *       
 *       **Required Roles:** PLATADMIN, ADMIN, AUDITOR, MANAGER
 *     tags: [Operators]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Operator ID
 *         example: 550e8400-e29b-41d4-a716-446655440000
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
 *         name: isCurrent
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: Filter by current ownership status
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
 *       400:
 *         description: Operator not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires PLATADMIN, ADMIN, AUDITOR, or MANAGER role
 *       404:
 *         description: Operator not found
 *       500:
 *         description: Internal Server Error
 */