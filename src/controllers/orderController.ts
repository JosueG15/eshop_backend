import { Request, Response } from "express";
import { OrderService } from "../services/orderService";
import { handleGlobalError, buildGlobalFilters } from "../helpers/globalHelper";
import { validatePaginationParams } from "../helpers/paginationHelper";
import { AuthenticatedRequest } from "../models/globalModels";
import { getNotFoundError } from "../helpers/errorHelper";

const orderService = new OrderService();

export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const newOrder = await orderService.createOrder(req.body, user!.userId);
    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    return handleGlobalError(res, "Failed to create order", error);
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const updatedOrder = await orderService.updateOrder(
      req.params.id,
      req.body
    );
    if (!updatedOrder) {
      const notFoundError = getNotFoundError(
        `Order with ID ${req.params.id} not found.`
      );
      return res.status(notFoundError.statusCode).json({
        success: false,
        error: notFoundError,
      });
    }
    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    return handleGlobalError(
      res,
      `Failed to update order with ID ${req.params.id}`,
      error
    );
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const deletedOrder = await orderService.deleteOrder(req.params.id);
    if (!deletedOrder) {
      const notFoundError = getNotFoundError(
        `Order with ID ${req.params.id} not found.`
      );
      return res.status(notFoundError.statusCode).json({
        success: false,
        error: notFoundError,
      });
    }
    res.json({
      success: true,
      message: `Order with ID ${req.params.id} deleted.`,
    });
  } catch (error) {
    return handleGlobalError(
      res,
      `Failed to delete order with ID ${req.params.id}`,
      error
    );
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { page, limit } = validatePaginationParams(req.query);
    const filters = buildGlobalFilters(req.query);

    const orders = await orderService.getAllOrders(filters, page, limit);
    const totalOrders = await orderService.getOrderCount(filters);

    res.json({
      success: true,
      page,
      limit,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      data: orders,
    });
  } catch (error) {
    return handleGlobalError(res, "Failed to fetch orders", error);
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) {
      const errorResponse = getNotFoundError(
        `Order with ID ${req.params.id} was not found`,
        { orderId: req.params.id }
      );
      return res
        .status(errorResponse.statusCode)
        .json({ success: false, error: errorResponse });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    return handleGlobalError(
      res,
      `Failed to fetch order with ID: ${req.params.id}`,
      error
    );
  }
};

export const getTotalSales = async (req: Request, res: Response) => {
  try {
    const totalSales = await orderService.calculateTotalSales();
    res.json({ success: true, data: totalSales });
  } catch (error) {
    return handleGlobalError(res, "Failed to calculate total sales", error);
  }
};
