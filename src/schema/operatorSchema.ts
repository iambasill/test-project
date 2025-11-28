import * as z from "zod";
import { Status, UserRole } from "../generated/prisma";
import { sanitizeObject } from "../utils/zodHandler";

const status = Object.values(Status);

export const operatorSchema = sanitizeObject(z.object({
    email: z.string(),         
    firstName: z.string(),            
    lastName: z.string(),             
    serviceNumber: z.string().optional(),         
    rank: z.string().optional(),                  
    branch: z.string().optional(),            
    position: z.string().optional(),              
    identificationType: z.string().optional(), 
    officialEmailAddress: z.string().optional(),  
    phoneNumber: z.string().optional(),        
    alternatePhoneNumber1: z.string().optional(),  
    alternatePhoneNumber2: z.string().optional(), 
    alternatePhoneNumber3: z.string().optional(),
}));

/**
 * @openapi
 * components:
 *   schemas:
 *     Operator:
 *       type: object
 *       required:
 *         - email
 *         - firstName
 *         - lastName
 *         
 *         
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the operator
 *         email:
 *           type: string
 *           format: email
 *           description: Operator's email address
 *         firstName:
 *           type: string
 *           description: Operator's first name
 *         lastName:
 *           type: string
 *           description: Operator's last name
 *         serviceNumber:
 *           type: string
 *           description: Unique service number
 *         rank:
 *           type: string
 *           description: Military rank
 *         branch:
 *           type: string
 *           nullable: true
 *           description: Military branch
 *         position:
 *           type: string
 *           nullable: true
 *           description: Current position
 *         identificationType:
 *           type: string
 *           nullable: true
 *           description: Type of identification
 *         officialEmailAddress:
 *           type: string
 *           format: email
 *           
 *           description: Official email address
 *         phoneNumber:
 *           type: string
 *           nullable: true
 *           description: Primary phone number
 *         alternatePhoneNumber1:
 *           type: string
 *           nullable: true
 *           description: First alternate phone number
 *         alternatePhoneNumber2:
 *           type: string
 *           nullable: true
 *           description: Second alternate phone number
 *         alternatePhoneNumber3:
 *           type: string
 *           nullable: true
 *           description: Third alternate phone number
 *         documents:
 *           type: array
 *           description: Associated documents
 *           items:
 *             $ref: '#/components/schemas/Document'
 *         ownerships:
 *           type: array
 *           description: Current equipment assignments
 *           items:
 *             $ref: '#/components/schemas/EquipmentOwnership'
 *         _count:
 *           type: object
 *           properties:
 *             ownerships:
 *               type: integer
 *             documents:
 *               type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the operator was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the operator was last updated
 *
 *     OperatorDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/Operator'
 *         - type: object
 *           properties:
 *             documents:
 *               type: array
 *               description: Operator's documents
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   fileName:
 *                     type: string
 *                   fileUrl:
 *                     type: string
 *                   fileType:
 *                     type: string
 *                   fileSize:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *             ownerships:
 *               type: array
 *               description: Equipment assignment history
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                   endDate:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                   isCurrent:
 *                     type: boolean
 *                   equipment:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       equipmentName:
 *                         type: string
 *                       chasisNumber:
 *                         type: string
 *                       model:
 *                         type: string
 *                       equipmentType:
 *                         type: string
 *                       currentCondition:
 *                         type: string
 *                   assignedBy:
 *                     type: object
 *                     properties:
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       email:
 *                         type: string
 *                   documents:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         fileName:
 *                           type: string
 *                         fileUrl:
 *                           type: string
 *                         fileType:
 *                           type: string
 *                         fileSize:
 *                           type: integer
 *
 *     EquipmentOwnership:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the ownership record
 *         operatorId:
 *           type: string
 *           description: ID of the operator
 *         equipmentId:
 *           type: string
 *           description: ID of the equipment
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Date when assignment started
 *         endDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Date when assignment ended (null if current)
 *         isCurrent:
 *           type: boolean
 *           description: Whether this is the current assignment
 *         equipment:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             equipmentName:
 *               type: string
 *             chasisNumber:
 *               type: string
 *             model:
 *               type: string
 *             equipmentType:
 *               type: string
 *             currentCondition:
 *               type: string
 *         assignedBy:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             email:
 *               type: string
 *         documents:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               fileName:
 *                 type: string
 *               fileUrl:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Document:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the document
 *         fileName:
 *           type: string
 *           description: Name of the file
 *         fileUrl:
 *           type: string
 *           description: URL to access the file
 *         fileType:
 *           type: string
 *           description: Type/category of the file
 *         fileSize:
 *           type: integer
 *           description: Size of the file in bytes
 *         operatorId:
 *           type: string
 *           nullable: true
 *           description: Associated operator ID
 *         equipmentId:
 *           type: string
 *           nullable: true
 *           description: Associated equipment ID
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */