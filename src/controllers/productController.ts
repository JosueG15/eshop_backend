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
        "Product required fields are missing"
      );
      return res
        .status(badRequestResponse.statusCode)
        .json({ success: false, error: badRequestResponse });
    }

    let parsedCategory;
    try {
      parsedCategory = JSON.parse(category);
    } catch (parseError) {
      const badRequestResponse = getBadRequestError(
        "Category format is invalid. Must be a valid JSON object."
      );
      return res
        .status(badRequestResponse.statusCode)
        .json({ success: false, error: badRequestResponse });
    }

    await checkCategoryExists(parsedCategory.id);

    const imageUrls = await imageUploadService.uploadImagesToS3(files);

    const newProductData = {
      ...req.body,
      category: parsedCategory.id,
      price: Number(price),
      countInStock: Number(countInStock),
      image: imageUrls[0],
      images: imageUrls,
    };

    const newProduct = await productService.createProduct(newProductData);

    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    return handleGlobalError(res, "Failed to create new product", error);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { category, price, countInStock } = req.body;
    const files = req.files as Express.Multer.File[];

    let updatedCategoryId;
    if (category) {
      try {
        const parsedCategory =
          typeof category === "string" ? JSON.parse(category) : category;
        updatedCategoryId = parsedCategory.id;
        await checkCategoryExists(updatedCategoryId);
      } catch (parseError) {
        const badRequestResponse = getBadRequestError(
          "Invalid category format. Must be a JSON object with a valid ID."
        );
        return res
          .status(badRequestResponse.statusCode)
          .json({ success: false, error: badRequestResponse });
      }
    }

    const imageUrls =
      files && files.length > 0
        ? await imageUploadService.uploadImagesToS3(files)
        : undefined;

    const updatedProductData = {
      ...req.body,
      ...(updatedCategoryId && { category: updatedCategoryId }),
      ...(price && { price: Number(price) }),
      ...(countInStock && { countInStock: Number(countInStock) }),
      ...(imageUrls && { image: imageUrls[0], images: imageUrls }),
    };

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
