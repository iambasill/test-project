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
 * /inspections:
 *   get:
 *     summary: Get all inspections
 *    tags:
 *    - Inspections
 * 
 *   security:
 *   - bearerAuth: []
 *  responses:
 *   200:
 *    description: A list of inspections
 *   content:
 *    application/json:
 *     schema:
 *     type: object
 *    properties:
 *    success:
 *    type: boolean
 *   data:
 *   type: array
 *   items:
 *    $ref: '#/schemas/Inspection'
 *  401:
 *   description: Unauthorized
 *  403:
 *  description: Forbidden
 *  500:
 *  description: Internal server error
 * /
 * @openapi
 * /inspections/equipment/{id}:
 *  get:
 *   summary: Get all inspections for a specific equipment
 *  tags:
 *  - Inspections
 *  parameters:
 *  - in: path
 *   name: id
 *  required: true
 *  schema:
 *   type: string
 *  description: Equipment ID
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 *  description: A list of inspections for the specified equipment
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * success:
 * type: boolean
 * data:
 * type: array
 * items:
 * $ref: '#/schemas/Inspection'
 * 401:
 * description: Unauthorized
 * 403:
 * description: Forbidden
 * 500:
 * description: Internal server error
 * /
 
 * @openapi
 * /inspections:
 * post:
 * summary: Create a new inspection
 * tags:
 * - Inspections
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/schemas/CreateInspection'
 * responses:
 * 201:
 * description: Inspection created successfully
 * content:
 * application/json:
 * schema:
 * type: object
 *  
 * properties:
 * success:
 * type: boolean
 * data:
 * $ref: '#/schemas/Inspection'
 * 401:
 * description: Unauthorized
 * 403:
 * description: Forbidden
 * 500:
 * description: Internal server error
 *  
 */
inspectionRouter.get('/equipment/:id', authMiddleware, getAllInspectionByEquipmentId);
inspectionRouter.get('/', authMiddleware, requireManagers, getAllInspection);
inspectionRouter.post('/', authMiddleware, requireIdempotencyKey,  upload.fields(INSPECTION_FIELDS), createInspection);


// inspectionRouter.delete('/:id',authMiddleware,requirePlatformAdmin,deleteInspection)



