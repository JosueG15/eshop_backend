import { Response, NextFunction } from "express";
import { verifyToken } from "../helpers/jwtHelper";
import redis from "../config/redisClient";
import { AuthenticatedRequest } from "../models/globalModels";

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    const isBlacklisted = await redis.get(token);
    if (isBlacklisted) {
      return res
        .status(401)
        .json({ success: false, message: "Token is blacklisted" });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
