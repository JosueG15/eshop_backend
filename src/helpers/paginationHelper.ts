import { GlobalQueryParams } from "../models/globalModels";

export const validatePaginationParams = (
  query: GlobalQueryParams
): { page: number; limit: number } => {
  const page = parseInt(query.page || "1", 10);
  const limit = parseInt(query.limit || "10", 10);

  if (isNaN(page) || page <= 0) {
    throw new Error("Invalid page number");
  }

  if (isNaN(limit) || limit <= 0) {
    throw new Error("Invalid limit number");
  }

  return { page, limit };
};
