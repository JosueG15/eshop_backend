import { Request, Response } from "express";
import { CategoryService } from "../services/categoryService";
import {
  getInternalServerError,
  getNotFoundError,
  getBadRequestError,
} from "../helpers/errorHelper";

const categoryService = new CategoryService();

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    const errorResponse = getInternalServerError(
      "Failed to fetch categories from database",
      error
    );
    res
      .status(errorResponse.statusCode)
      .json({ success: false, error: errorResponse });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) {
      const notFoundResponse = getNotFoundError(
        `Category with id: ${req.params.id} was not found`
      );
      return res
        .status(notFoundResponse.statusCode)
        .json({ success: false, error: notFoundResponse });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    const errorResponse = getInternalServerError(
      `Failed to fetch category with id: ${req.params.id}`,
      error
    );
    res
      .status(errorResponse.statusCode)
      .json({ success: false, error: errorResponse });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { name, color, icon, image } = req.body;
  try {
    if (!name) {
      const badRequestError = getBadRequestError(
        "Name is required to create a new category"
      );
      return res
        .status(badRequestError.statusCode)
        .json({ success: false, error: badRequestError });
    }

    const newCategory = await categoryService.createCategory({
      name,
      color,
      icon,
      image,
    });
    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    const errorResponse = getInternalServerError(
      `Failed to create a new category`,
      {
        error,
        body: { name, color, icon, image },
      }
    );
    res
      .status(errorResponse.statusCode)
      .json({ success: false, error: errorResponse });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const updatedCategory = await categoryService.updateCategory(
      req.params.id,
      req.body
    );

    if (!updatedCategory) {
      const notFoundResponse = getNotFoundError(
        `No category was found with id: ${req.params.id}`
      );
      return res
        .status(notFoundResponse.statusCode)
        .json({ success: false, error: notFoundResponse });
    }

    res.json({ success: true, data: updatedCategory });
  } catch (error) {
    const errorResponse = getInternalServerError(
      `Failed to update category with id: ${req.params.id}`,
      {
        error,
        body: req.body,
      }
    );
    res
      .status(errorResponse.statusCode)
      .json({ success: false, error: errorResponse });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const deleteCategory = await categoryService.deleteCategory(req.params.id);

    if (!deleteCategory) {
      const notFoundResponse = getNotFoundError(
        `No category was found with id: ${req.params.id}`
      );
      return res
        .status(notFoundResponse.statusCode)
        .json({ sucess: false, error: notFoundResponse });
    }

    res.json({ success: true, data: "Category was deleted successfully" });
  } catch (error) {
    const errorResponse = getInternalServerError(
      `Failed to delete category with id: ${req.params.id}`,
      error
    );
    res
      .status(errorResponse.statusCode)
      .json({ success: false, error: errorResponse });
  }
};
