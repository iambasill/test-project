import * as z from "zod";
import {  Status, UserRole } from "../generated/prisma";
import { sanitizeObject } from "../utils/zodHandler";

const status = Object.values(Status)


export const signUpSchema = sanitizeObject(z.object({
    firstName: z.string(),
    lastName: z.string(),
    email:z.string(),
    role: z.enum(UserRole),
}))

export const loginSchema= sanitizeObject(z.object({
    email:z.string(),
    password: z.string()
}))

export const emailSchema= sanitizeObject(z.object({
    email:z.string()
}))

export const userIdSchema= sanitizeObject(z.object({
    userId:z.string()
}))

export const changePasswordSchema= sanitizeObject(z.object({
    token:z.string(),
    newPassword: z.string()
}))

   



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


export const QuerySchema = sanitizeObject(z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).optional().default(1),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional().default(10),
  equipmentChasisNumber: z.string().optional(),
  operatorId: z.string().uuid().optional(),
  isCurrent: z.string().transform(val => val === 'true').pipe(z.boolean()).optional(),
}));

export const operatorSchema = sanitizeObject(z.object({
    email: z.string(),         
    firstName: z.string(),            
    lastName: z.string(),             
    serviceNumber: z.string(),         
    rank: z.string(),                  
    branch: z.string().optional(),            
    position: z.string().optional(),              
    identificationType: z.string().optional(), 
    officialEmailAddress : z.string().optional(),  
    phoneNumber : z.string().optional(),        
    alternatePhoneNumber1: z.string().optional(),  
    alternatePhoneNumber2 : z.string().optional(), 
    alternatePhoneNumber3: z.string().optional(),

}));

export const tokenSchema= sanitizeObject(z.object({
    refreshToken:z.string()
}))





// Schema for individual inspection items
export const InspectionItemSchema = sanitizeObject(z.object({
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string(),
  recommendation: z.string().optional().nullable(),
  condition: z.string(),
  notes: z.string().optional().nullable(),
}

));

// Schema for creating an inspection
export const CreateInspectionSchema = sanitizeObject(z.object({
  equipmentId: z.string(),
  generalNotes: z.string().optional().nullable(),
  overallCondition: z.enum(status),
  items: z.array(InspectionItemSchema).min(1, 'At least one inspection item is required')
}));


export const inspectionCategorySchema = sanitizeObject(z.object({
  title: z.string(),
  subcategories: z.json()

}));
