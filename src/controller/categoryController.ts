import {Request,Response} from 'express'
import { BadRequestError } from '../logger/exceptions';
import { sanitizeInput } from '../utils/helperFunction';
import { prismaclient } from '../lib/prisma-connect';
import { inspectionCategorySchema } from '../validator/authValidator';


export const getAllCategory = async (req:Request, res:Response) => {
  const category = await prismaclient.inspectionCategory.findMany({
  });
  
  res.status(200).json({
    success: true,
    data: category
  });
};



export const createCategory = async (req:Request, res:Response) => {
    const data = inspectionCategorySchema.parse(req.body)

    const category = await prismaclient.inspectionCategory.findFirst({
    where:{
        title: data.title.toLowerCase(),
        subCategories: data.subcategories || null
    }
  })

  if (category) throw new BadRequestError('Catgory already exist')

  await prismaclient.inspectionCategory.create({
    data:{
        ...data
    }
  })


  res.status(201).json({
    success: true,
    message: 'Category created successfully',
  });
};




export const updateCategory = async (req:Request, res:Response) => {
    const data = inspectionCategorySchema.parse(req.body)

  let {id} = req.params
  id = sanitizeInput(id)



  const category = await prismaclient.inspectionCategory.findFirst({
    where:{
        id
    }
  })

  if (!category) throw new BadRequestError("category does not exist")

 await prismaclient.inspectionCategory.update({
    where:{
        id
    },
    data:{
        ...data
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
  const category = await prismaclient.inspectionCategory.findUnique({
    where:{id}
  })

  if (!category) throw new BadRequestError('Category not found')
  
  await prismaclient.inspectionCategory.delete({
    where:{id}
  })

    res.status(200).json({
    success: true,
    message: 'category deleted successfully',
  });

}
