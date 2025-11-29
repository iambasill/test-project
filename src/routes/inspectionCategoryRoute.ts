import express from "express";
import { 
  createCategory, 
  deleteCategory, 
  getAllCategory, 
  getCategoryById,
  updateCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory
} from '../controller/categoryController';
import { requireAdmins, requireOfficers } from '../middlewares/rbacMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';

export const categoryRouter = express.Router();

// Category routes
categoryRouter.get('/', authMiddleware, requireOfficers, getAllCategory);
categoryRouter.get('/:id', authMiddleware, requireOfficers, getCategoryById);
categoryRouter.post('/', authMiddleware, requireOfficers, createCategory);
categoryRouter.put('/:id', authMiddleware, requireOfficers, updateCategory);
categoryRouter.delete('/:id', authMiddleware, requireOfficers, deleteCategory);

// Subcategory routes
categoryRouter.post('/:id/subcategories', authMiddleware, requireOfficers, addSubCategory);
categoryRouter.put('/:id/subcategories/:subCategoryId', authMiddleware, requireOfficers, updateSubCategory);
categoryRouter.delete('/:id/subcategories/:subCategoryId', authMiddleware, requireOfficers, deleteSubCategory);

/**
 * @openapi
 * tags:
 *   name: Categories
 *   description: Inspection category management endpoints
 */

/**
 * @openapi
 * /inspection/category:
 *   get:
 *     summary: Get all inspection categories with pagination
 *     description: |
 *       Retrieves a paginated list of inspection categories with their subcategories.
 *       
 *       **Required Roles:** PLATADMIN, ADMIN, AUDITOR, OFFICER
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *           default: "1"
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *           default: "10"
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by category title
 *     responses:
 *       200:
 *         description: List of categories with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InspectionCategory'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     page:
 *                       type: number
 *                     limit:
 *                       type: number
 *                     totalPages:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires PLATADMIN, ADMIN, AUDITOR, or OFFICER role
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /inspection/category/{id}:
 *   get:
 *     summary: Get a single category by ID
 *     description: |
 *       Retrieves detailed information about a specific inspection category including its subcategories.
 *       
 *       **Required Roles:** PLATADMIN, ADMIN, AUDITOR, OFFICER
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details with subcategories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/InspectionCategory'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires PLATADMIN, ADMIN, AUDITOR, or OFFICER role
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /inspection/category:
 *   post:
 *     summary: Create a new inspection category
 *     description: |
 *       Creates a new inspection category with optional subcategories.
 *       
 *       **Required Roles:** PLATADMIN, ADMIN, AUDITOR, OFFICER
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategory'
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/InspectionCategory'
 *       400:
 *         description: Category already exists or invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires PLATADMIN, ADMIN, AUDITOR, or OFFICER role
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /inspection/category/{id}:
 *   put:
 *     summary: Update a category
 *     description: |
 *       Updates an existing inspection category.
 *       
 *       **Required Roles:** PLATADMIN, ADMIN, AUDITOR, OFFICER
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategory'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/InspectionCategory'
 *       400:
 *         description: Invalid data or category not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires PLATADMIN, ADMIN, AUDITOR, or OFFICER role
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /inspection/category/{id}:
 *   delete:
 *     summary: Delete a category
 *     description: |
 *       Deletes an inspection category. Cannot delete if category has related records.
 *       
 *       **Required Roles:** PLATADMIN, ADMIN, AUDITOR, OFFICER
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Category not found or has related records
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires PLATADMIN, ADMIN, AUDITOR, or OFFICER role
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /inspection/category/{id}/subcategories:
 *   post:
 *     summary: Add a subcategory to a category
 *     description: |
 *       Adds a new subcategory to an existing inspection category.
 *       
 *       **Required Roles:** PLATADMIN, ADMIN, AUDITOR, OFFICER
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSubCategory'
 *     responses:
 *       201:
 *         description: Subcategory added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/InspectionCategory'
 *       400:
 *         description: Invalid data or duplicate subcategory
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires PLATADMIN, ADMIN, AUDITOR, or OFFICER role
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /inspection/category/{id}/subcategories/{subCategoryId}:
 *   put:
 *     summary: Update a subcategory
 *     description: |
 *       Updates an existing subcategory within a category.
 *       
 *       **Required Roles:** PLATADMIN, ADMIN, AUDITOR, OFFICER
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *       - in: path
 *         name: subCategoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Subcategory ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSubCategory'
 *     responses:
 *       200:
 *         description: Subcategory updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/InspectionCategory'
 *       400:
 *         description: Invalid data or subcategory not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires PLATADMIN, ADMIN, AUDITOR, or OFFICER role
 *       404:
 *         description: Category or subcategory not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /inspection/category/{id}/subcategories/{subCategoryId}:
 *   delete:
 *     summary: Delete a subcategory
 *     description: |
 *       Deletes a subcategory from a category. Cannot delete if subcategory has related records.
 *       
 *       **Required Roles:** PLATADMIN, ADMIN, AUDITOR, OFFICER
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *       - in: path
 *         name: subCategoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Subcategory ID
 *     responses:
 *       200:
 *         description: Subcategory deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/InspectionCategory'
 *       400:
 *         description: Subcategory not found or has related records
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires PLATADMIN, ADMIN, AUDITOR, or OFFICER role
 *       404:
 *         description: Category or subcategory not found
 *       500:
 *         description: Internal Server Error
 */