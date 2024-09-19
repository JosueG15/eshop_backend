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
import { ImageUploadService } from "../services/imageUploadService";

const productService = new ProductService();
const imageUploadService = new ImageUploadService();

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
    const files = req.files as Express.Multer.File[];

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

    const imageUrls = await imageUploadService.uploadImagesToS3(files);

    const newProduct = await productService.createProduct({
      ...req.body,
      image: imageUrls[0],
      images: imageUrls,
    });

    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    return handleGlobalError(res, "Failed to create new product", error);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { category } = req.body;
    const files = req.files as Express.Multer.File[];

    if (category) {
      await checkCategoryExists(category);
    }

    let updatedProductData = req.body;
    if (files && files.length > 0) {
      const imageUrls = await imageUploadService.uploadImagesToS3(files);
      updatedProductData = {
        ...req.body,
        image: imageUrls[0],
        images: imageUrls,
      };
    }

    const updatedProduct = await productService.updateProduct(
      req.params.id,
      updatedProductData
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
    const product = await productService.getProductById(req.params.id);

    if (!product) {
      const notFoundResponse = getNotFoundError(
        `Product with id: ${req.params.id} was not found`
      );
      return res
        .status(notFoundResponse.statusCode)
        .json({ success: false, error: notFoundResponse });
    }

    const imageKeysToDelete: string[] = [];
    if (product.images && product.images.length > 0) {
      imageKeysToDelete.push(...product.images);
    }

    await imageUploadService.deleteImagesFromS3(imageKeysToDelete);

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
    const errorResponse = getInternalServerError(
      `Failed to delete product with id: ${req.params.id}`,
      error
    );
    return res
      .status(errorResponse.statusCode)
      .json({ success: false, error: errorResponse });
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
