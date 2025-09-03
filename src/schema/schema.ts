import * as z from "zod";
import { AcquisitionMethod, ConditionStatus, UserRole } from "../generated/prisma";
export const signUpSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email:z.string(),
    role: z.enum(UserRole),
})

export const loginSchema= z.object({
    email:z.string(),
    password: z.string()
})

export const equipmentData = z.object({
    chasisNumber: z.string(),
    equipmentName:     z.string(),
    model   :          z.string(),
    equipmentType :    z.string(),
    equipmentCategory: z.string(),
    manufacturer  :    z.string(),
    modelNumber :      z.string().optional(),
    yearOfManufacture: z.string().optional(),
    countryOfOrigin:   z.string(),
    dateOfAcquisition :  z.string(),
    acquisitionMethod :  z.enum(AcquisitionMethod),
    supplierInfo  :      z.string(),
    purchaseOrderNumber :z.string().optional(),
    contractReference :  z.string().optional(),
    costValue  :      z.string().optional(),        
    currency  :          z.string().optional(),          
    fundingSource :      z.string().optional(),
    weight :          z.string().optional(),
    dimensions:              z.string().optional(),
    powerRequirements :      z.string().optional(),
    fuelType  :              z.string().optional(),
    maximumRange   :         z.string().optional(),
    operationalSpecs   :     z.string().optional(),  
    requiredCertifications : z.string().optional(), 
    environmentalConditions: z.string().optional(), 
    currentCondition:    z.enum(ConditionStatus).optional(),
    lastConditionCheck: z.string().optional()
})



export const inspectionData = z.object({
        equipmentId: z.string(),
        nextDueDate:z.string() ,
        overallNotes: z.string(),
        exteriorInspections: z.array(z.object()),
        interiorInspections: z.array(z.object()),
        mechanicalInspections: z.array(z.object()),
        functionalInspections: z.array(z.object()),
        documentLegalInspections: z.array(z.object())
    

})
export const ConditionStatusEnum = z.enum(['EXCELLENT', 'GOOD', 'FAIR', 'POOR']);



export const CreateEquipmentOwnershipSchema = z.object({
  equipmentId: z.string(),
  operatorId: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional().nullable(),
  primaryDuties: z.string().optional().nullable(),
  driverLicenseId: z.string().optional().nullable(),
  
  // Commander information
  coFirstName: z.string().optional().nullable(),
  coLastName: z.string().optional().nullable(),
  coEmail: z.string().optional().nullable(),
  coPhoneNumber: z.string().optional().nullable(),
  
  // Equipment condition
  conditionAtAssignment: ConditionStatusEnum.optional().default('EXCELLENT'),
  notes: z.string().optional().nullable(),
});



export const UpdateEquipmentOwnershipSchema = z.object({
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
  conditionAtAssignment: ConditionStatusEnum.optional(),
  notes: z.string().optional().nullable(),
});

const QuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).optional().default(1),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional().default(10),
  equipmentChasisNumber: z.string().optional(),
  operatorId: z.string().uuid().optional(),
  isCurrent: z.string().transform(val => val === 'true').pipe(z.boolean()).optional(),
});