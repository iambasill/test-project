import {Request,Response} from 'express'
import { BadRequestError } from '../httpClass/exceptions';
import { prisma } from '../server';


// Get all operator
export const getAllOperator = async (req:Request, res:Response) => {
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

export const createOperator = async (req:Request, res:Response) => {
  const operatorData = req.body;
  
  const equipment = await prisma.operator.create({
    data: {
      ...operatorData,
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