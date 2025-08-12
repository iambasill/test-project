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