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
import { requireAdmins } from '../middlewares/rbacMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';

export const categoryRouter = express.Router();

// Category routes
categoryRouter.get('/', authMiddleware, requireAdmins, getAllCategory);
categoryRouter.get('/:id', authMiddleware, requireAdmins, getCategoryById);
categoryRouter.post('/', authMiddleware, requireAdmins, createCategory);
categoryRouter.put('/:id', authMiddleware, requireAdmins, updateCategory);
categoryRouter.delete('/:id', authMiddleware, requireAdmins, deleteCategory);

// Subcategory routes
categoryRouter.post('/:id/subcategories', authMiddleware, requireAdmins, addSubCategory);
categoryRouter.put('/:id/subcategories/:subCategoryId', authMiddleware, requireAdmins, updateSubCategory);
categoryRouter.delete('/:id/subcategories/:subCategoryId', authMiddleware, requireAdmins, deleteSubCategory);



/**
 * @openapi
 * /inspection/category:
 *   get:
 *     summary: Get all inspection categories with pagination
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
 *         description: Forbidden - Admin access required
 */

/**
 * @openapi
 * /inspection/category/{id}:
 *   get:
 *     summary: Get a single category by ID
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
 *       404:
 *         description: Category not found
 */

/**
 * @openapi
 * /inspection/category:
 *   post:
 *     summary: Create a new inspection category
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
 *         description: Category already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */

/**
 * @openapi
 * /inspection/category/{id}:
 *   put:
 *     summary: Update a category
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
 *         description: Forbidden - Admin access required
 */

/**
 * @openapi
 * /inspection/category/{id}:
 *   delete:
 *     summary: Delete a category
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
 *         description: Forbidden - Admin access required
 */

/**
 * @openapi
 * /inspection/category/{id}/subcategories:
 *   post:
 *     summary: Add a subcategory to a category
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
 *         description: Forbidden - Admin access required
 */

/**
 * @openapi
 * /inspection/category/{id}/subcategories/{subCategoryId}:
 *   put:
 *     summary: Update a subcategory
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
 *         description: Forbidden - Admin access required
 */

/**
 * @openapi
 * /inspection/category/{id}/subcategories/{subCategoryId}:
 *   delete:
 *     summary: Delete a subcategory
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
 *         description: Forbidden - Admin access required
 */
