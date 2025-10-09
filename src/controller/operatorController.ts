import {Request,Response} from 'express'
import { BadRequestError, unAuthorizedError } from '../httpClass/exceptions';
import { PrismaClient } from "../generated/prisma";
import { sanitizeInput } from '../utils/helperFunction';
import { operatorSchema } from '../schema/schema';
import { config } from '../config/envConfig';

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
    serviceNumber,         
  } = operatorSchema.parse(req.body)

    const operator = await prisma.operator.findFirst({
    where:{serviceNumber}
  })

  if (operator) throw new BadRequestError('Operator already exist')

  await prisma.$transaction(async(tx) => {

  const operator = await tx.operator.create({
    data: {
      ...operatorSchema.parse(req.body)
    }
  });
  
  // Create documents if files exist
    if (req.files) {
      const files = req.files as Record<string, Express.Multer.File[]>;
      const fileData = Object.entries(files).map(([fileName, [file]]) => ({
        fileName,
        fileUrl: `${config.API_BASE_URL}/attachment/${file.filename}`,
        operatorId: operator.id
      }));
      

      await tx.document.createMany({
        data: fileData,
      });
    }
  })


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

    await prisma.$transaction(async (tx) => {

      
    await tx.operator.update({
    where:{id},
    data: {
    ...operatorSchema.parse(req.body)  
    }
  });
  
   // Update documents if files exist
    if (req.files) {
      const files = req.files as Record<string, Express.Multer.File[]>;
      const fileData = Object.entries(files).map(([fileName, [file]]) => ({
        fileName,
        fileUrl: `${config.API_BASE_URL}/attachment/${file.filename}`,
        operatorId: operator.id
      }));

      // Only update/replace the documents that were actually uploaded
      for (const fileInfo of fileData) {
        // Check if document with this fileName already exists
        const existingDocument = await tx.document.findFirst({
          where: {
           operatorId: operator.id,
            fileName: fileInfo.fileName
          }
        });

        if (existingDocument) {
          // Update existing document
          await tx.document.update({
            where: { id: existingDocument.id },
            data: {
              fileUrl: fileInfo.fileUrl
            }
          });
        } else {
          // Create new document if it doesn't exist
          await tx.document.create({
            data: fileInfo
          });
        }
      }
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
  let {id} = req.params
  id = sanitizeInput(id)

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
