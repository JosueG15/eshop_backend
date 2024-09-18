import jwt from "jsonwebtoken";
import { JwtPayload } from "../models/jwtModel";

const JWT_SECRET = process.env.JWT_SECRET || "itca";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export const generateToken = (payload: JwtPayload, expiresIn: string) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "itca", { expiresIn });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, process.env.JWT_SECRET || "itca") as JwtPayload;
};
