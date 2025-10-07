import * as z from "zod";
import { AcquisitionMethod, ConditionStatus, UserRole } from "../generated/prisma";
import sanitizeHtml from "sanitize-html";

const status = Object.values(ConditionStatus)


const sanitizeObject = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) => {
  return z.object(
    Object.fromEntries(
      Object.entries(schema.shape).map(([key, value]) => {
        if (value instanceof z.ZodString) {
          return [
            key,
            value.transform((val) =>
              sanitizeHtml(val, {
                allowedTags: [],
                parser: {
                  decodeEntities: true,
                },
              })
            ),
          ];
        }
        return [key, value];
      })
    ) as T
  );
};


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
    currentCondition:    z.enum(status).optional(),
    lastConditionCheck: z.string().optional(),
    warrantyStartDate: z.string().optional(),
    warrantyEndDate: z.string().optional(),
    warrantyCoverageDetails :z.string().optional()
}))



export const inspectionData = sanitizeObject(z.object({
        equipmentId: z.string(),
        nextDueDate:z.string() ,
        overallNotes: z.string(),
        exteriorInspections: z.array(z.object()),
        interiorInspections: z.array(z.object()),
        mechanicalInspections: z.array(z.object()),
        functionalInspections: z.array(z.object()),
        documentLegalInspections: z.array(z.object())
    

}))




export const CreateEquipmentOwnershipSchema = sanitizeObject(z.object({
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