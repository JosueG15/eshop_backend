import { Request, Response } from "express";
import { CategoryService } from "../services/categoryService";
import {
  getInternalServerError,
  getNotFoundError,
  getBadRequestError,
} from "../helpers/errorHelper";
import { ImageUploadService } from "../services/imageUploadService";

const categoryService = new CategoryService();
const imageUploadService = new ImageUploadService();

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
  const { name, color, icon } = req.body;
  let image = "";

  try {
    if (!name) {
      const badRequestError = getBadRequestError(
        "Name is required to create a new category"
      );
      return res
        .status(badRequestError.statusCode)
        .json({ success: false, error: badRequestError });
    }

    if (req.file) {
      const uploadedImage = await imageUploadService.uploadImageToS3(req.file);
      image = uploadedImage.Location;
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
      "Failed to create a new category",
      error
    );
    res
      .status(errorResponse.statusCode)
      .json({ success: false, error: errorResponse });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name, color, icon } = req.body;
    let image = req.body.image;

    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) {
      const notFoundResponse = getNotFoundError(
        `No category found with id: ${req.params.id}`
      );
      return res
        .status(notFoundResponse.statusCode)
        .json({ success: false, error: notFoundResponse });
    }

    if (req.file) {
      const uploadedImage = await imageUploadService.uploadImageToS3(req.file);
      image = uploadedImage.Location;
    }

    const updatedCategory = await categoryService.updateCategory(
      req.params.id,
      {
        name,
        color,
        icon,
        image,
      }
    );

    res.json({ success: true, data: updatedCategory });
  } catch (error) {
    const errorResponse = getInternalServerError(
      `Failed to update category with id: ${req.params.id}`,
      error
    );
    res
      .status(errorResponse.statusCode)
      .json({ success: false, error: errorResponse });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
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

    if (category.image) {
      await imageUploadService.deleteImageFromS3(category.image);
    }

    const deletedCategory = await categoryService.deleteCategory(req.params.id);

    if (!deletedCategory) {
      const notFoundResponse = getNotFoundError(
        `Category with id: ${req.params.id} was not found`
      );
      return res
        .status(notFoundResponse.statusCode)
        .json({ success: false, error: notFoundResponse });
    }

    res.json({ success: true, data: "Category deleted successfully" });
  } catch (error) {
    const errorResponse = getInternalServerError(
      `Failed to delete category with id: ${req.params.id}`,
      error
    );
    return res
      .status(errorResponse.statusCode)
      .json({ success: false, error: errorResponse });
  }
};
