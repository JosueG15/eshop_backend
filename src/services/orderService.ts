import Order from "../models/orderModel";
import mongoose from "mongoose";
import { IOrder } from "../models/orderModel";
import {
  validateOrderItemsStock,
  updateProductStock,
  deleteOrderItems,
  createOrderItems,
  calculateTotalPrice,
} from "../helpers/orderHelper";
import { getInternalServerError } from "../helpers/errorHelper";

export class OrderService {
  async createOrder(orderData: IOrder, user: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await validateOrderItemsStock(orderData.orderItems);

      const orderItemsIds = await createOrderItems(
        orderData.orderItems,
        session
      );

      const totalPrice = await calculateTotalPrice(orderItemsIds, session);

      const newOrder = new Order({
        orderItems: orderItemsIds,
        shippingAddress1: orderData.shippingAddress1,
        shippingAddress2: orderData.shippingAddress2 || "",
        city: orderData.city,
        zip: orderData.zip,
        country: orderData.country,
        phone: orderData.phone,
        status: "Pending",
        totalPrice,
        user,
        dateOrdered: new Date(),
      });

      const savedOrder = await newOrder.save({ session });

      await updateProductStock(orderData.orderItems, session);

      await session.commitTransaction();
      session.endSession();

      return savedOrder;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw getInternalServerError("Failed to create order", error);
    }
  }

  async updateOrder(
    orderId: string,
    orderData: Partial<IOrder>
  ): Promise<IOrder | null> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await Order.findById(orderId).session(session);
      if (!order) {
        await session.abortTransaction();
        session.endSession();
        return null;
      }

      if (orderData.orderItems) {
        await validateOrderItemsStock(orderData.orderItems);
        await updateProductStock(orderData.orderItems, session);
      }

      Object.assign(order, orderData);

      const updatedOrder = await order.save({ session });

      await session.commitTransaction();
      session.endSession();

      return updatedOrder;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw getInternalServerError(
        `Failed to update order with ID ${orderId}`,
        error
      );
    }
  }

  async deleteOrder(orderId: string): Promise<IOrder | null> {
    const order = await Order.findById(orderId);
    if (!order) return null;

    await deleteOrderItems(order.orderItems);

    return await Order.findByIdAndDelete(orderId);
  }

  async getAllOrders(
    filters: Record<string, any>,
    page: number,
    limit: number
  ): Promise<IOrder[]> {
    const skip = (page - 1) * limit;
    return await Order.find(filters)
      .populate("orderItems")
      .populate("user")
      .skip(skip)
      .limit(limit);
  }

  async getOrderById(orderId: string): Promise<IOrder | null> {
    return await Order.findById(orderId)
      .populate("orderItems")
      .populate("user");
  }

  async getOrderCount(filters: Record<string, any>): Promise<number> {
    return await Order.countDocuments(filters).exec();
  }

  async calculateTotalSales(): Promise<number> {
    const result = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    if (result.length === 0) {
      return 0;
    }

    return result[0].totalSales;
  }
}
