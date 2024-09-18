import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { buildGlobalFilters, handleGlobalError } from "../helpers/globalHelper";
import { validatePaginationParams } from "../helpers/paginationHelper";

const userService = new UserService();

export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    if (error instanceof Error && error.message === "Email already exists") {
      return res.status(400).json({
        success: false,
        error:
          "The email address is already in use. Please use a different email.",
      });
    }

    if (error instanceof Error) {
      return handleGlobalError(res, "Failed to create new user", error);
    }

    return handleGlobalError(
      res,
      "An unknown error occurred",
      new Error(String(error))
    );
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: `User with ID ${req.params.id} was not found`,
      });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    return handleGlobalError(
      res,
      `Failed to fetch user with ID: ${req.params.id}`,
      error
    );
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { page, limit } = validatePaginationParams(req.query);
    const filters = buildGlobalFilters(req.query);

    const users = await userService.getAllUsers(filters, page, limit);
    const totalUsers = await userService.getUserCount(filters);

    res.json({
      success: true,
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      data: users,
    });
  } catch (error) {
    return handleGlobalError(res, "Failed to fetch users", error);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: `User with ID ${req.params.id} was not found and could not be updated`,
      });
    }
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    return handleGlobalError(
      res,
      `Failed to update user with ID: ${req.params.id}`,
      error
    );
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        error: `User with ID ${req.params.id} was not found and could not be deleted`,
      });
    }
    res.json({
      success: true,
      message: `User with ID ${req.params.id} was deleted successfully`,
    });
  } catch (error) {
    return handleGlobalError(
      res,
      `Failed to delete user with ID: ${req.params.id}`,
      error
    );
  }
};

export const getUserCount = async (req: Request, res: Response) => {
  try {
    const filters = buildGlobalFilters(req.query);
    const totalUsers = await userService.getUserCount(filters);

    res.json({ success: true, count: totalUsers });
  } catch (error) {
    return handleGlobalError(res, "Failed to fetch user count", error);
  }
};
