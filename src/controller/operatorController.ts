import { Operator, User } from './../generated/prisma/index.d';
import {Request,Response} from 'express'
import { BadRequestError, unAuthorizedError } from '../httpClass/exceptions';
import { prisma } from '../server';


export const getAllOperator = async (req:Request, res:Response) => {
  const user:any = req.user
  if (user.role === "OFFICER") throw new unAuthorizedError
  const operator = await prisma.operator.findMany({
    include: {
      ownerships:true,
      documents: true,
      equipment:true
    }
  });
  
  res.status(200).json({
    success: true,
    data: operator
  });
};

export const getAllOperatorById = async (req:Request, res:Response) => {
  const {id} = req.params
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

  } = req.body

    const operator = await prisma.operator.findFirst({
    where:{email}
  })

  if (operator) throw new BadRequestError('Operator already exist')

  
  const equipment = await prisma.operator.create({
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
    },
    include: {
      ownerships: true,
      documents: true,
      equipment: true
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
  const {id} = req.params

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

  } = req.body
  
  const equipment = await prisma.operator.update({
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
    },
    include: {
      ownerships: true,
      documents: true,
      equipment: true
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
