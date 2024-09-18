import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { handleGlobalError } from "../helpers/globalHelper";

const authService = new AuthService();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { token } = await authService.login(email, password);
    res.status(200).json({ success: true, token });
  } catch (error) {
    return handleGlobalError(res, "Failed to log in", error);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    await authService.logout(token!);
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return handleGlobalError(res, "Failed to log out", error);
  }
};
