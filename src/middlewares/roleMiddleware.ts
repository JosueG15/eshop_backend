import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../models/globalModels";

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.isAdmin) {
    let errorMessage = "Access denied. Admins only.";

    if (
      req.method === "PATCH" &&
      /^\/users\/\w+$/.test(req.path) &&
      req.body.hasOwnProperty("isAdmin")
    ) {
      errorMessage = "Access denied. Only admins can grant privileges.";
    } else {
      next();
    }

    return res.status(403).json({ success: false, message: errorMessage });
  }
  next();
};
