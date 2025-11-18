import {Request,Response} from 'express'
import { BadRequestError } from '../logger/exceptions';
import { sanitizeInput } from '../utils/helperFunction';
import { prismaclient } from '../lib/prisma-connect';


export const getAllCategory = async (req:Request, res:Response) => {
  const category = await prismaclient.equipmentCategory.findMany({
  });
  
  res.status(200).json({
    success: true,
    data: category
  });
};



export const createCategory = async (req:Request, res:Response) => {

    const {name} = sanitizeInput(req.body.name)

    const category = await prismaclient.equipmentCategory.findFirst({
    where:{name}
  })

  if (category) throw new BadRequestError('Catgory already exist')

  await prismaclient.equipmentCategory.create({
    data:{
        name
    }
  })


  res.status(201).json({
    success: true,
    message: 'Category created successfully',
  });
};

export const updateCategory = async (req:Request, res:Response) => {
  let {id} = req.params
  id = sanitizeInput(id)
  const {name} = sanitizeInput(req.body.name)


  const category = await prismaclient.equipmentCategory.findFirst({
    where:{
        id
    }
  })

  if (!category) throw new BadRequestError("category does not exist")

 await prismaclient.equipmentCategory.update({
    where:{
        id
    },
    data:{
        name
    }
 })
  
  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
  });
};

export const deleteCategory = async (req:Request, res:Response) => {
  let {id} = req.params
  id = sanitizeInput(id)
  const category = await prismaclient.equipmentCategory.findUnique({
    where:{id}
  })

  if (!category) throw new BadRequestError('Category not found')
  
  await prismaclient.equipmentCategory.delete({
    where:{id}
  })

    res.status(200).json({
    success: true,
    message: 'category deleted successfully',
  });

}
