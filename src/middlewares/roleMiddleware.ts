import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../models/globalModels";

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.isAdmin) {
    let errorMessage = "Access denied. Admins only.";
    return res.status(403).json({ success: false, message: errorMessage });
  }
  next();
};
