// import { Request, Response } from 'express';
// import { BadRequestError } from '../logger/exceptions';
// import { sanitizeInput } from '../utils/helperFunction';
// import { prismaclient } from '../lib/prisma-connect';
// import { z } from 'zod';

// // ==================== ZOD SCHEMAS ====================

// // Schema for creating a category
// export const createCategorySchema = z.object({
//   title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
//   subCategories: z
//     .array(
//       z.object({
//         title: z.string().min(1, 'Subcategory title is required').max(100)
//       })
//     )
//     .optional()
//     .default([])
// });

// // Schema for updating a category
// export const updateCategorySchema = z.object({
//   title: z.string().min(1, 'Title is required').max(100, 'Title too long').optional(),
//   subCategories: z
//     .array(
//       z.object({
//         title: z.string().min(1, 'Subcategory title is required').max(100)
//       })
//     )
//     .optional()
// });

// // Schema for creating/updating a subcategory
// export const subCategorySchema = z.object({
//   title: z.string().min(1, 'Title is required').max(100, 'Title too long')
// });

// // Schema for query parameters
// export const getCategoriesQuerySchema = z.object({
//   page: z.string().optional().default('1'),
//   limit: z.string().optional().default('10'),
//   search: z.string().optional()
// });

// // ==================== CATEGORY CONTROLLERS ====================

// /**
//  * Get all categories with pagination and search
//  */
// export const getAllCategory = async (req: Request, res: Response) => {
//   const { page, limit, search } = getCategoriesQuerySchema.parse(req.query);

//   const skip = (Number(page) - 1) * Number(limit);
//   const take = Number(limit);

//   const where = search
//     ? {
//         title: {
//           contains: search,
//           mode: 'insensitive' as const
//         }
//       }
//     : {};

//   const [categories, total] = await Promise.all([
//     prismaclient.inspectionCategory.findMany({
//       where,
//       skip,
//       take,
//       orderBy: { createdAt: 'desc' }
//     }),
//     prismaclient.inspectionCategory.count({ where })
//   ]);

//   res.status(200).json({
//     success: true,
//     data: categories,
//     pagination: {
//       total,
//       page: Number(page),
//       limit: Number(limit),
//       totalPages: Math.ceil(total / Number(limit))
//     }
//   });
// };

// /**
//  * Get a single category by ID
//  */
// export const getCategoryById = async (req: Request, res: Response) => {
//   let { id } = req.params;
//   id = sanitizeInput(id);

//   const category = await prismaclient.inspectionCategory.findUnique({
//     where: { id }
//   });

//   if (!category) {
//     throw new BadRequestError('Category not found');
//   }

//   res.status(200).json({
//     success: true,
//     data: category
//   });
// };

// /**
//  * Create a new category with optional subcategories
//  */
// export const createCategory = async (req: Request, res: Response) => {
//   const data = createCategorySchema.parse(req.body);

//   // Check if category already exists (case-insensitive)
//   const existingCategory = await prismaclient.inspectionCategory.findFirst({
//     where: {
//       title: {
//         equals: data.title,
//         mode: 'insensitive'
//       }
//     }
//   });

//   if (existingCategory) {
//     throw new BadRequestError('Category already exists');
//   }

//   // Create category with subcategories as JSON
//   const category = await prismaclient.inspectionCategory.create({
//     data: {
//       title: data.title,
//       subCategories: data.subCategories.length > 0 ? data.subCategories : null
//     }
//   });

//   res.status(201).json({
//     success: true,
//     message: 'Category created successfully',
//     data: category
//   });
// };

// /**
//  * Update a category
//  */
// export const updateCategory = async (req: Request, res: Response) => {
//   const data = updateCategorySchema.parse(req.body);
//   let { id } = req.params;
//   id = sanitizeInput(id);

//   // Check if category exists
//   const category = await prismaclient.inspectionCategory.findUnique({
//     where: { id }
//   });

//   if (!category) {
//     throw new BadRequestError('Category does not exist');
//   }

//   // If updating title, check for duplicates
//   if (data.title) {
//     const existingCategory = await prismaclient.inspectionCategory.findFirst({
//       where: {
//         title: {
//           equals: data.title,
//           mode: 'insensitive'
//         },
//         NOT: { id }
//       }
//     });

//     if (existingCategory) {
//       throw new BadRequestError('A category with this title already exists');
//     }
//   }

//   // Update category
//   const updatedCategory = await prismaclient.inspectionCategory.update({
//     where: { id },
//     data: {
//       ...(data.title && { title: data.title }),
//       ...(data.subCategories !== undefined && {
//         subCategories: data.subCategories.length > 0 ? data.subCategories : null
//       })
//     }
//   });

//   res.status(200).json({
//     success: true,
//     message: 'Category updated successfully',
//     data: updatedCategory
//   });
// };

// /**
//  * Delete a category
//  */
// export const deleteCategory = async (req: Request, res: Response) => {
//   let { id } = req.params;
//   id = sanitizeInput(id);

//   const category = await prismaclient.inspectionCategory.findUnique({
//     where: { id }
//   });

//   if (!category) {
//     throw new BadRequestError('Category not found');
//   }

//   try {
//     await prismaclient.inspectionCategory.delete({
//       where: { id }
//     });

//     res.status(200).json({
//       success: true,
//       message: 'Category deleted successfully'
//     });
//   } catch (error) {
//     throw new BadRequestError(
//       'Cannot delete category. It may be referenced by other records.'
//     );
//   }
// };

// // ==================== SUBCATEGORY CONTROLLERS ====================

// /**
//  * Add a subcategory to an existing category
//  */
// export const addSubCategory = async (req: Request, res: Response) => {
//   const data = subCategorySchema.parse(req.body);
//   let { id } = req.params;
//   id = sanitizeInput(id);

//   // Get existing category
//   const category = await prismaclient.inspectionCategory.findUnique({
//     where: { id }
//   });

//   if (!category) {
//     throw new BadRequestError('Category not found');
//   }

//   // Get existing subcategories
//   const existingSubCategories = (category.subCategories as any[]) || [];

//   // Check if subcategory already exists
//   const subCategoryExists = existingSubCategories.some(
//     (sub: any) => sub.title.toLowerCase() === data.title.toLowerCase()
//   );

//   if (subCategoryExists) {
//     throw new BadRequestError('Subcategory already exists in this category');
//   }

//   // Add new subcategory
//   const updatedSubCategories = [...existingSubCategories, data];

//   const updatedCategory = await prismaclient.inspectionCategory.update({
//     where: { id },
//     data: {
//       subCategories: updatedSubCategories
//     }
//   });

//   res.status(201).json({
//     success: true,
//     message: 'Subcategory added successfully',
//     data: updatedCategory
//   });
// };

// /**
//  * Update a subcategory by index
//  */
// export const updateSubCategory = async (req: Request, res: Response) => {
//   const data = subCategorySchema.parse(req.body);
//   let { id, index } = req.params;
//   id = sanitizeInput(id);
//   const subCategoryIndex = parseInt(index);

//   if (isNaN(subCategoryIndex) || subCategoryIndex < 0) {
//     throw new BadRequestError('Invalid subcategory index');
//   }

//   // Get existing category
//   const category = await prismaclient.inspectionCategory.findUnique({
//     where: { id }
//   });

//   if (!category) {
//     throw new BadRequestError('Category not found');
//   }

//   const existingSubCategories = (category.subCategories as any[]) || [];

//   if (subCategoryIndex >= existingSubCategories.length) {
//     throw new BadRequestError('Subcategory not found');
//   }

//   // Check if new title conflicts with other subcategories
//   const titleConflict = existingSubCategories.some(
//     (sub: any, idx: number) =>
//       idx !== subCategoryIndex &&
//       sub.title.toLowerCase() === data.title.toLowerCase()
//   );

//   if (titleConflict) {
//     throw new BadRequestError('A subcategory with this title already exists');
//   }

//   // Update subcategory
//   existingSubCategories[subCategoryIndex] = data;

//   const updatedCategory = await prismaclient.inspectionCategory.update({
//     where: { id },
//     data: {
//       subCategories: existingSubCategories
//     }
//   });

//   res.status(200).json({
//     success: true,
//     message: 'Subcategory updated successfully',
//     data: updatedCategory
//   });
// };

// /**
//  * Delete a subcategory by index
//  */
// export const deleteSubCategory = async (req: Request, res: Response) => {
//   let { id, index } = req.params;
//   id = sanitizeInput(id);
//   const subCategoryIndex = parseInt(index);

//   if (isNaN(subCategoryIndex) || subCategoryIndex < 0) {
//     throw new BadRequestError('Invalid subcategory index');
//   }

//   // Get existing category
//   const category = await prismaclient.inspectionCategory.findUnique({
//     where: { id }
//   });

//   if (!category) {
//     throw new BadRequestError('Category not found');
//   }

//   const existingSubCategories = (category.subCategories as any[]) || [];

//   if (subCategoryIndex >= existingSubCategories.length) {
//     throw new BadRequestError('Subcategory not found');
//   }

//   // Remove subcategory
//   existingSubCategories.splice(subCategoryIndex, 1);

//   const updatedCategory = await prismaclient.inspectionCategory.update({
//     where: { id },
//     data: {
//       subCategories: existingSubCategories.length > 0 ? existingSubCategories : null
//     }
//   });

//   res.status(200).json({
//     success: true,
//     message: 'Subcategory deleted successfully',
//     data: updatedCategory
//   });
// };