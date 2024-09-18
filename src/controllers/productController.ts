import { Request, Response } from "express";
import { ProductService } from "../services/productService";
import {
  getBadRequestError,
  getInternalServerError,
  getNotFoundError,
} from "../helpers/errorHelper";
import { buildGlobalFilters, handleGlobalError } from "../helpers/globalHelper";
import { validatePaginationParams } from "../helpers/paginationHelper";
import { checkCategoryExists } from "../helpers/productHelper";

const productService = new ProductService();

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { page, limit } = validatePaginationParams(req.query);
    const filters = buildGlobalFilters(req.query);

    const products = await productService.getAllProducts(filters, page, limit);
    const totalProducts = await productService.getProductCount(filters);

    res.json({
      success: true,
      page,
      limit,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      data: products,
    });
  } catch (error) {
    return handleGlobalError(res, "Failed to fetch products", error);
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      const notFoundResponse = getNotFoundError(
        `Product with id: ${req.params.id} was not found`
      );
      return res.status(404).json({ success: false, error: notFoundResponse });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    const errorResponse = getInternalServerError(
      `Failed to fetch product with id: ${req.params.id}`,
      error
    );
    res
      .status(errorResponse.statusCode)
      .json({ success: false, error: errorResponse });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, countInStock } = req.body;

    if (!name || !description || !price || !category || !countInStock) {
      const badRequestResponse = getBadRequestError(
        "Product required fields are missing",
        { body: req.body }
      );
      return res
        .status(badRequestResponse.statusCode)
        .json({ success: false, error: badRequestResponse });
    }

    await checkCategoryExists(category);

    const newProduct = await productService.createProduct(req.body);
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    return handleGlobalError(res, "Failed to create new product", error);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { category } = req.body;

    if (category) {
      await checkCategoryExists(category); // Category existence check
    }

    const updatedProduct = await productService.updateProduct(
      req.params.id,
      req.body
    );
    if (!updatedProduct) {
      const notFoundResponse = getNotFoundError(
        `Product with id: ${req.params.id} was not found`
      );
      return res
        .status(notFoundResponse.statusCode)
        .json({ success: false, error: notFoundResponse });
    }
    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    return handleGlobalError(
      res,
      `Failed to update product with id: ${req.params.id}`,
      error
    );
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deletedProduct = await productService.deleteProduct(req.params.id);
    if (!deletedProduct) {
      const notFoundResponse = getNotFoundError(
        `Product with id: ${req.params.id} was not found`
      );
      return res
        .status(notFoundResponse.statusCode)
        .json({ success: false, error: notFoundResponse });
    }
    res.json({ success: true, data: "Product deleted successfully" });
  } catch (error) {
    return handleGlobalError(
      res,
      `Failed to delete product with id: ${req.params.id}`,
      error
    );
  }
};

export const getProductCount = async (req: Request, res: Response) => {
  try {
    const filters = buildGlobalFilters(req.query);
    const count = await productService.getProductCount(filters);
    res.json({ success: true, count });
  } catch (error) {
    return handleGlobalError(res, "Failed to get product count", error);
  }
};

export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const featuredProducts = await productService.getFeaturedProducts(
      page,
      limit
    );
    res.json({ success: true, page, limit, data: featuredProducts });
  } catch (error) {
    const errorResponse = getInternalServerError(
      "Failed to get featured products",
      {
        error,
      }
    );
    res
      .status(errorResponse.statusCode)
      .json({ success: false, error: errorResponse });
  }
};
