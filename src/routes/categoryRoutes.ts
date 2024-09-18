import { Router } from "express";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { protect } from "../middlewares/authMiddleware";
import { requireAdmin } from "../middlewares/roleMiddleware";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the category
 *         name:
 *           type: string
 *           description: The name of the category
 *         color:
 *           type: string
 *           description: The color representing the category
 *         icon:
 *           type: string
 *           description: The icon for the category
 *         image:
 *           type: string
 *           description: The image URL for the category
 *       example:
 *         id: 613b3ed72e733b26ff443e59
 *         name: Electronics
 *         color: "#FFFFFF"
 *         icon: "some-icon"
 *         image: "https://example.com/category-image.png"
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     security:
 *       - bearerAuth: []
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of all categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/categories", getCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a single category by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: The category data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/categories/:id", getCategory);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     security:
 *       - bearerAuth: []
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: The category was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad request (missing required fields)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/categories", protect, requireAdmin, createCategory);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update an existing category by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: The category was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/categories/:id", protect, requireAdmin, updateCategory);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: The category was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/categories/:id", protect, requireAdmin, deleteCategory);

export default router;
