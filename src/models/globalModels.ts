import { JwtPayload } from "./jwtModel";
import { Request } from "express";

export interface GlobalFilters {
  category?: string;
  price?: {
    $gte?: number;
    $lte?: number;
  };
  isFeatured?: boolean;
  role?: string;
}

export interface GlobalQueryParams {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  role?: string;
  isFeatured?: string;
  page?: string;
  limit?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}