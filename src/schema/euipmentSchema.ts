import * as z from "zod";
import { Status, UserRole } from "../generated/prisma";
import { sanitizeObject } from "../utils/zodHandler";

const status = Object.values(Status);

// ==================== EQUIPMENT SCHEMAS ====================

/**
 * Schema for creating equipment
 */
export const equipmentData = sanitizeObject(z.object({
  chasisNumber: z.string().min(1, 'Chasis number is required'),
  vehicleRegistrationNumber: z.string().optional().nullable(),
  engineNumber: z.string().optional().nullable(),
  itemName: z.string().optional().nullable(),
  equipmentName: z.string().min(1, 'Equipment name is required'),
  model: z.string().optional().nullable(),
  vehicleType: z.string().optional().nullable(),
  vehicleMake: z.string().optional().nullable(),
  furnitureType: z.string().optional().nullable(),
  materialType: z.string().optional().nullable(),
  brand: z.string().optional().nullable(),
  propertyType: z.string().optional().nullable(),
  propertyAddress: z.string().optional().nullable(),
  propertySize: z.string().optional().nullable(),
  noOfRooms: z.string().optional().nullable(),
  equipmentCategory: z.string().min(1, 'Equipment category is required'),
  noOfBathrooms: z.string().optional().nullable(),
  serialNumber: z.string().optional().nullable(),
  equipmentType: z.string().optional().nullable(),
  yearOfManufacture: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  registrationNumber: z.string().optional().nullable(),
  dateAcquired: z.string().optional().nullable(),

  currentCondition: z.enum(status,  ({ message: 'Condition must be S, O, A, B, or C' })
  )
}));

/**
 * Schema for updating equipment (all fields optional except ID)
 */
export const updateEquipmentSchema = sanitizeObject(z.object({
  chasisNumber: z.string().min(1).optional(),
  vehicleRegistrationNumber: z.string().optional().nullable(),
  engineNumber: z.string().optional().nullable(),
  itemName: z.string().optional().nullable(),
  equipmentName: z.string().min(1).optional(),
  model: z.string().optional().nullable(),
  vehicleType: z.string().optional().nullable(),
  vehicleMake: z.string().optional().nullable(),
  furnitureType: z.string().optional().nullable(),
  materialType: z.string().optional().nullable(),
  brand: z.string().optional().nullable(),
  propertyType: z.string().optional().nullable(),
  propertyAddress: z.string().optional().nullable(),
  propertySize: z.string().optional().nullable(),
  noOfRooms: z.string().optional().nullable(),
  equipmentCategory: z.string().optional(),
  noOfBathrooms: z.string().optional().nullable(),
  serialNumber: z.string().optional().nullable(),
  equipmentType: z.string().optional().nullable(),
  yearOfManufacture: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  registrationNumber: z.string().optional().nullable(),
  dateAcquired: z.string().optional().nullable(),
  currentCondition: z.enum(status).optional(),
}));

/**
 * Schema for equipment query parameters
 */
export const getEquipmentQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  search: z.string().optional(),
  category: z.string().optional(),
  condition: z.enum(status).optional(),
  vehicleType: z.string().optional(),
});

// ==================== EQUIPMENT OWNERSHIP SCHEMAS ====================

/**
 * Schema for creating equipment ownership
 */
export const CreateEquipmentOwnershipSchema = sanitizeObject(z.object({
  equipmentId: z.string().uuid('Invalid equipment ID'),
  operatorId: z.string().uuid('Invalid operator ID'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  primaryDuties: z.string().optional().nullable(),
  driverLicenseId: z.string().optional().nullable(),
  
  // Commander information
  coFirstName: z.string().optional().nullable(),
  coLastName: z.string().optional().nullable(),
  coEmail: z.string().email('Invalid email').optional().nullable(),
  coPhoneNumber: z.string().optional().nullable(),
  
  // Equipment condition
  conditionAtAssignment: z.enum(status, 
    ({ message: 'Condition must be S, O, A, B, or C' }) ),
  notes: z.string().optional().nullable(),
}));

/**
 * Schema for updating equipment ownership
 */
export const UpdateEquipmentOwnershipSchema = sanitizeObject(z.object({
  equipmentId: z.string().uuid().optional(),
  operatorId: z.string().uuid().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().optional(),
  primaryDuties: z.string().optional().nullable(),
  driverLicenseId: z.string().optional().nullable(),
  
  // Commander information
  coFirstName: z.string().optional().nullable(),
  coLastName: z.string().optional().nullable(),
  coEmail: z.string().email('Invalid email').optional().nullable(),
  coPhoneNumber: z.string().optional().nullable(),
  
  // Equipment condition
  conditionAtAssignment: z.enum(status).optional(),
  notes: z.string().optional().nullable(),
}));

/**
 * Schema for ownership query parameters
 */
export const getOwnershipQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  isCurrent: z.string().optional(),
  equipmentId: z.string().optional(),
  operatorId: z.string().optional(),
});

// Export types for TypeScript
export type EquipmentInput = z.infer<typeof equipmentData>;
export type UpdateEquipmentInput = z.infer<typeof updateEquipmentSchema>;
export type GetEquipmentQuery = z.infer<typeof getEquipmentQuerySchema>;
export type CreateOwnershipInput = z.infer<typeof CreateEquipmentOwnershipSchema>;
export type UpdateOwnershipInput = z.infer<typeof UpdateEquipmentOwnershipSchema>;
export type GetOwnershipQuery = z.infer<typeof getOwnershipQuerySchema>;

/**
 * @openapi
 * components:
 *   schemas:
 *     Equipment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         chasisNumber:
 *           type: string
 *         vehicleRegistrationNumber:
 *           type: string
 *           nullable: true
 *         engineNumber:
 *           type: string
 *           nullable: true
 *         itemName:
 *           type: string
 *           nullable: true
 *         equipmentName:
 *           type: string
 *         model:
 *           type: string
 *           nullable: true
 *         vehicleType:
 *           type: string
 *           nullable: true
 *         vehicleMake:
 *           type: string
 *           nullable: true
 *         furnitureType:
 *           type: string
 *           nullable: true
 *         materialType:
 *           type: string
 *           nullable: true
 *         brand:
 *           type: string
 *           nullable: true
 *         propertyType:
 *           type: string
 *           nullable: true
 *         propertyAddress:
 *           type: string
 *           nullable: true
 *         propertySize:
 *           type: string
 *           nullable: true
 *         noOfRooms:
 *           type: string
 *           nullable: true
 *         equipmentCategory:
 *           type: string
 *         noOfBathrooms:
 *           type: string
 *           nullable: true
 *         serialNumber:
 *           type: string
 *           nullable: true
 *         equipmentType:
 *           type: string
 *           nullable: true
 *         yearOfManufacture:
 *           type: string
 *           nullable: true
 *         color:
 *           type: string
 *           nullable: true
 *         registrationNumber:
 *           type: string
 *           nullable: true
 *         dateAcquired:
 *           type: string
 *           nullable: true
 *         currentCondition:
 *           type: string
 *           enum: ["S", "O", "A", "B", "C"]
 *         addedById:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateEquipment:
 *       type: object
 *       required:
 *         - chasisNumber
 *         - equipmentName
 *         - equipmentCategory
 *         - currentCondition
 *       properties:
 *         chasisNumber:
 *           type: string
 *         vehicleRegistrationNumber:
 *           type: string
 *         engineNumber:
 *           type: string
 *         itemName:
 *           type: string
 *         equipmentName:
 *           type: string
 *         model:
 *           type: string
 *         vehicleType:
 *           type: string
 *         vehicleMake:
 *           type: string
 *         furnitureType:
 *           type: string
 *         materialType:
 *           type: string
 *         brand:
 *           type: string
 *         propertyType:
 *           type: string
 *         propertyAddress:
 *           type: string
 *         propertySize:
 *           type: string
 *         noOfRooms:
 *           type: string
 *         equipmentCategory:
 *           type: string
 *         noOfBathrooms:
 *           type: string
 *         serialNumber:
 *           type: string
 *         equipmentType:
 *           type: string
 *         yearOfManufacture:
 *           type: string
 *         color:
 *           type: string
 *         registrationNumber:
 *           type: string
 *         dateAcquired:
 *           type: string
 *         currentCondition:
 *           type: string
 *           enum: ["S", "O", "A", "B", "C"]
 *           default: "S"
 *         documents:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *           description: Equipment documents (images, PDFs, etc.)
 *
 
 *
 *     CreateEquipmentOwnership:
 *       type: object
 *       required:
 *         - equipmentId
 *         - operatorId
 *       properties:
 *         equipmentId:
 *           type: string
 *         operatorId:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         primaryDuties:
 *           type: string
 *         driverLicenseId:
 *           type: string
 *         coFirstName:
 *           type: string
 *         coLastName:
 *           type: string
 *         coEmail:
 *           type: string
 *           format: email
 *         coPhoneNumber:
 *           type: string
 *         conditionAtAssignment:
 *           type: string
 *           enum: ["S", "O", "A", "B", "C"]
 *         notes:
 *           type: string
 *         documents:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *           description: Ownership documents
 */