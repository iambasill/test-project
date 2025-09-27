import {Request,Response} from 'express'
import { BadRequestError, unAuthorizedError } from '../httpClass/exceptions';
import { PrismaClient } from "../generated/prisma";
import { sanitizeInput } from '../utils/helperFunction';
import { operatorSchema } from '../schema/schema';

const prisma = new PrismaClient()

export const getAllOperator = async (req:Request, res:Response) => {
  const user:any = req.user
  if (user.role === "OFFICER") throw new unAuthorizedError
  const operator = await prisma.operator.findMany({
  });
  
  res.status(200).json({
    success: true,
    data: operator
  });
};

export const getAllOperatorById = async (req:Request, res:Response) => {
  let {id} = req.params
  id = sanitizeInput(id)
    const user:any = req.user
  if (user.role === "OFFICER") throw new unAuthorizedError

  const operator = await prisma.operator.findUnique({
    where:{id}
  })

  if (!operator) throw new BadRequestError('Operator not found')
  
  res.status(200).json({
    success: true,
    operator: operator
  });
};


export const createOperator = async (req:Request, res:Response) => {
  const user:any = req.user
  if (user.role === "OFFICER") throw new unAuthorizedError

  const {
    email,         
    firstName,            
    lastName,             
    serviceNumber,         
    rank,                  
    branch,                
    position,              
    identificationType,    
    officialEmailAddress,  
    phoneNumber,           
    alternatePhoneNumber1,  
    alternatePhoneNumber2,  
    alternatePhoneNumber3  

  } = operatorSchema.parse(req.body)

    const operator = await prisma.operator.findFirst({
    where:{serviceNumber}
  })

  if (operator) throw new BadRequestError('Operator already exist')

  
   await prisma.operator.create({
    data: {
    email,         
    firstName,            
    lastName,             
    serviceNumber,         
    rank,                  
    branch,                
    position,              
    identificationType,    
    officialEmailAddress,  
    phoneNumber,           
    alternatePhoneNumber1,  
    alternatePhoneNumber2,  
    alternatePhoneNumber3 
    }
  });
  
  res.status(201).json({
    success: true,
    message: 'Operator created successfully',
  });
};

export const updateOperator = async (req:Request, res:Response) => {
  const user:any = req.user
  if (user.role === "OFFICER") throw new unAuthorizedError
  let {id} = req.params
  id = sanitizeInput(id)

  const operator = await prisma.operator.findUnique({
    where:{id}
  })

  if (!operator) throw new BadRequestError('Operator not found')

  const {
    email,         
    firstName,            
    lastName,             
    serviceNumber,         
    rank,                  
    branch,                
    position,              
    identificationType,    
    officialEmailAddress,  
    phoneNumber,           
    alternatePhoneNumber1,  
    alternatePhoneNumber2,  
    alternatePhoneNumber3  

  } = operatorSchema.parse(req.body)
  
    await prisma.operator.update({
    where:{id},
    data: {
    email,         
    firstName,            
    lastName,             
    serviceNumber,         
    rank,                  
    branch,                
    position,              
    identificationType,    
    officialEmailAddress,  
    phoneNumber,           
    alternatePhoneNumber1,  
    alternatePhoneNumber2,  
    alternatePhoneNumber3 
    }
  });
  
  res.status(200).json({
    success: true,
    message: 'Operator updated successfully',
  });
};

export const deleteOperator = async (req:Request, res:Response) => {
  const user:any = req.user
  if (user.role === "OFFICER") throw new unAuthorizedError
  const {id} = req.params

  const operator = await prisma.operator.findUnique({
    where:{id}
  })

  if (!operator) throw new BadRequestError('Operator not found')
  
  await prisma.operator.delete({
    where:{id}
  })

    res.status(200).json({
    success: true,
    message: 'Operator deleted successfully',
  });

}
