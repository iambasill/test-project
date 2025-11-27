import * as z from "zod";
import {  Status, UserRole } from "../generated/prisma";
import { sanitizeObject } from "../utils/zodHandler";
const status = Object.values(Status)

export const equipmentData = sanitizeObject(z.object({
    chasisNumber: z.string().min(1),
    vehicleRegistrationNumber: z.string().optional().nullable(),
    engineNumber: z.string().optional().nullable(),
    itemName: z.string().optional().nullable(),
    equipmentName: z.string().min(1),
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
    equipmentCategory: z.string(),
    noOfBathrooms: z.string().optional().nullable(),
    serialNumber: z.string().optional().nullable(),
    equipmentType: z.string().optional().nullable(),
    yearOfManufacture: z.string().optional().nullable(),
    color: z.string().optional().nullable(),
    registrationNumber: z.string().optional().nullable(),
    dateAcquired: z.string().optional().nullable(),
    currentCondition: z.enum(status).default("S"),
}))


export const CreateEquipmentOwnershipSchema = sanitizeObject(z.object({
  equipmentId: z.string(),
  operatorId: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  primaryDuties: z.string().optional().nullable(),
  driverLicenseId: z.string().optional().nullable(),
  
  // Commander information
  coFirstName: z.string().optional().nullable(),
  coLastName: z.string().optional().nullable(),
  coEmail: z.string().optional().nullable(),
  coPhoneNumber: z.string().optional().nullable(),
  
  // Equipment condition
  conditionAtAssignment: z.enum(status).optional(),
  notes: z.string().optional().nullable(),
}));



export const UpdateEquipmentOwnershipSchema = sanitizeObject(z.object({
  equipmentChasisNumber: z.string().min(1).optional(),
  operatorId: z.string().uuid().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().optional(),
  primaryDuties: z.string().optional().nullable(),
  driverLicenseId: z.string().optional().nullable(),
  
  // Commander information
  coFirstName: z.string().optional().nullable(),
  coLastName: z.string().optional().nullable(),
  coEmail: z.string().optional().nullable(),
  coPhoneNumber: z.string().optional().nullable(),
  
  // Equipment condition
  conditionAtAssignment: z.enum(status).optional(),
  notes: z.string().optional().nullable(),
}));
