import { Response } from "express";
import { getBadRequestError, getInternalServerError } from "./errorHelper";
import { GlobalQueryParams, GlobalFilters } from "../models/globalModels";

export const handleGlobalError = (
  res: Response,
  message: string,
  error: any
) => {
  const errorResponse = getInternalServerError(message, error);
  return res.status(errorResponse.statusCode).json({
    success: false,
    error: errorResponse,
  });
};

export const buildGlobalFilters = (query: GlobalQueryParams): GlobalFilters => {
  const { category, minPrice, maxPrice, isFeatured, role, name, userId } =
    query;
  const filters: GlobalFilters = {};

  if (name) {
    filters.name = { $regex: name, $options: "i" };
  }

  // Category filter (for products)
  if (category) {
    const categories = category.split(",");
    filters.category = { $in: categories };
  }

  // Price filter (for products)
  if (minPrice) {
    const minPriceValue = parseFloat(minPrice);
    if (isNaN(minPriceValue)) {
      throw getBadRequestError("Invalid minPrice value", { minPrice });
    }
    filters.price = { ...filters.price, $gte: minPriceValue };
  }

  if (maxPrice) {
    const maxPriceValue = parseFloat(maxPrice);
    if (isNaN(maxPriceValue)) {
      throw getBadRequestError("Invalid maxPrice value", { maxPrice });
    }
    filters.price = { ...filters.price, $lte: maxPriceValue };
  }

  // Featured filter (for products)
  if (isFeatured !== undefined) {
    filters.isFeatured = isFeatured === "true";
  }

  // Role filter (for users)
  if (role) {
    if (role !== "admin" && role !== "non-admin") {
      throw getBadRequestError("Invalid role value", { role });
    }
    filters.role = role;
  }

  // User ID filter to get orders specific to a user
  if (userId) {
    filters.user = userId;
  }

  return filters;
};
