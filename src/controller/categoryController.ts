import { Request, Response } from 'express';
import { BadRequestError } from '../logger/exceptions';
import { sanitizeInput } from '../utils/helperFunction';
import { prismaclient } from '../lib/prisma-connect';
import { getCategoriesQuerySchema, inspectionCategorySchema, subCategoryInspectionSchema } from '../schema/inspectionCategorySchema';

// ==================== CATEGORY CONTROLLERS ====================

/**
 * Get all categories with pagination and search
 */
export const getAllCategory = async (req: Request, res: Response) => {
  const { page, limit, search } = getCategoriesQuerySchema.parse(req.query);

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where = search
    ? {
        title: {
          contains: search,
          mode: 'insensitive' as const
        }
      }
    : {};

  const [categories, total] = await Promise.all([
    prismaclient.inspectionCategory.findMany({
      where,
      skip,
      take,
      include: {
        subCategories: true
      },
      orderBy: { createdAt: 'desc' }
    }),
    prismaclient.inspectionCategory.count({ where })
  ]);

  res.status(200).json({
    success: true,
    data: categories,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    }
  });
};

/**
 * Get a single category by ID
 */
export const getCategoryById = async (req: Request, res: Response) => {
  let { id } = req.params;
  id = sanitizeInput(id);

  const category = await prismaclient.inspectionCategory.findUnique({
    where: { id },
    include: {
      subCategories: true
    }
  });

  if (!category) {
    throw new BadRequestError('Category not found');
  }

  res.status(200).json({
    success: true,
    data: category
  });
};

/**
 * Create a new category 
 */
export const createCategory = async (req: Request, res: Response) => {
  const data = inspectionCategorySchema.parse(req.body);

  // Check if category already exists (case-insensitive)
  const existingCategory = await prismaclient.inspectionCategory.findFirst({
    where: {
      title: data.title.toLowerCase()
    }
  });

  if (existingCategory) {
    throw new BadRequestError('Category already exists');
  }

  const category = await prismaclient.inspectionCategory.create({
    data: {
      title: data.title.toLowerCase()
    },
    include: {
      subCategories: true
    }
  });

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: category
  });
};

/**
 * Update a category
 */
export const updateCategory = async (req: Request, res: Response) => {
  const data = inspectionCategorySchema.parse(req.body);
  let { id } = req.params;
  id = sanitizeInput(id);

  // Check if category exists
  const category = await prismaclient.inspectionCategory.findUnique({
    where: { id }
  });

  if (!category) {
    throw new BadRequestError('Category does not exist');
  }

  // Check if new title conflicts with another category
  if (data.title.toLowerCase() !== category.title.toLowerCase()) {
    const titleConflict = await prismaclient.inspectionCategory.findFirst({
      where: {
        title: data.title.toLowerCase(),
        id: { not: id }
      }
    });

    if (titleConflict) {
      throw new BadRequestError('A category with this title already exists');
    }
  }

  // Update category
  const updatedCategory = await prismaclient.inspectionCategory.update({
    where: { id },
    data: {
      title: data.title.toLowerCase()
    },
    include: {
      subCategories: true
    }
  });

  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: updatedCategory
  });
};

/**
 * Delete a category
 */
export const deleteCategory = async (req: Request, res: Response) => {
  let { id } = req.params;
  id = sanitizeInput(id);

  const category = await prismaclient.inspectionCategory.findUnique({
    where: { id }
  });

  if (!category) {
    throw new BadRequestError('Category not found');
  }

  try {
    // SubCategories will be cascade deleted due to onDelete: Cascade in schema
    await prismaclient.inspectionCategory.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    throw new BadRequestError(
      'Cannot delete category. It may be referenced by other records.'
    );
  }
};

// ==================== SUBCATEGORY CONTROLLERS ====================

/**
 * Add a subcategory to an existing category
 */
export const addSubCategory = async (req: Request, res: Response) => {
  const data = subCategoryInspectionSchema.parse(req.body);
  let { id } = req.params;
  id = sanitizeInput(id);

  // Verify the categoryId matches the route param
  if (data.categoryId !== id) {
    throw new BadRequestError('Category ID mismatch');
  }

  // Check if category exists
  const category = await prismaclient.inspectionCategory.findUnique({
    where: { id }
  });

  if (!category) {
    throw new BadRequestError('Category not found');
  }

  // Check if subcategory with same title already exists for this category
  // The schema has @@unique([categoryId, title])
  const existingSubCategory = await prismaclient.subCategory.findFirst({
    where: {
      categoryId: id,
      title: data.title
    }
  });

  if (existingSubCategory) {
    throw new BadRequestError('A subcategory with this title already exists in this category');
  }

  // Create the subcategory
  const subCategory = await prismaclient.subCategory.create({
    data: {
      title: data.title,
      categoryId: id
    }
  });

  // Return updated category with subcategories
  const updatedCategory = await prismaclient.inspectionCategory.findUnique({
    where: { id },
    include: {
      subCategories: true
    }
  });

  res.status(201).json({
    success: true,
    message: 'Subcategory added successfully',
    data: updatedCategory
  });
};

/**
 * Update a subcategory
 */
export const updateSubCategory = async (req: Request, res: Response) => {
  const data = subCategoryInspectionSchema.parse(req.body);
  let { id, subCategoryId } = req.params;
  id = sanitizeInput(id);
  const sanitizedSubCategoryId = sanitizeInput(subCategoryId);

  // Verify the categoryId matches the route param
  if (data.categoryId !== id) {
    throw new BadRequestError('Category ID mismatch');
  }

  // Check if subcategory exists and belongs to the category
  const subCategory = await prismaclient.subCategory.findUnique({
    where: { id: sanitizedSubCategoryId }
  });

  if (!subCategory) {
    throw new BadRequestError('Subcategory not found');
  }

  if (subCategory.categoryId !== id) {
    throw new BadRequestError('Subcategory does not belong to this category');
  }

  // Check if new title conflicts with other subcategories in same category
  if (subCategory.title !== data.title) {
    const titleConflict = await prismaclient.subCategory.findFirst({
      where: {
        categoryId: id,
        title: data.title,
        id: { not: sanitizedSubCategoryId }
      }
    });

    if (titleConflict) {
      throw new BadRequestError('A subcategory with this title already exists in this category');
    }
  }

  // Update subcategory
  await prismaclient.subCategory.update({
    where: { id: sanitizedSubCategoryId },
    data: {
      title: data.title
    }
  });

  // Return updated category with subcategories
  const updatedCategory = await prismaclient.inspectionCategory.findUnique({
    where: { id },
    include: {
      subCategories: true
    }
  });

  res.status(200).json({
    success: true,
    message: 'Subcategory updated successfully',
    data: updatedCategory
  });
};

/**
 * Delete a subcategory
 */
export const deleteSubCategory = async (req: Request, res: Response) => {
  let { id, subCategoryId } = req.params;
  id = sanitizeInput(id);
  const sanitizedSubCategoryId = sanitizeInput(subCategoryId);

  // Check if subcategory exists and belongs to the category
  const subCategory = await prismaclient.subCategory.findUnique({
    where: { id: sanitizedSubCategoryId }
  });

  if (!subCategory) {
    throw new BadRequestError('Subcategory not found');
  }

  if (subCategory.categoryId !== id) {
    throw new BadRequestError('Subcategory does not belong to this category');
  }

  try {
    await prismaclient.subCategory.delete({
      where: { id: sanitizedSubCategoryId }
    });

    // Return updated category with subcategories
    const updatedCategory = await prismaclient.inspectionCategory.findUnique({
      where: { id },
      include: {
        subCategories: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'Subcategory deleted successfully',
      data: updatedCategory
    });
  } catch (error) {
    throw new BadRequestError(
      'Cannot delete subcategory. It may be referenced by other records.'
    );
  }
};