import mongoose from "mongoose";
import Product, { IProduct } from "../models/productModel";
import OrderItem, { IOrderItem } from "../models/orderItemModel";
import { getNotFoundError, getBadRequestError } from "../helpers/errorHelper";

export const validateOrderItemsStock = async (orderItems: IOrderItem[]) => {
  for (const item of orderItems) {
    const product = await Product.findById(item.id);

    if (!product) {
      throw getNotFoundError("Product not found", {
        product: item.product,
      });
    }

    if (product.countInStock < item.quantity) {
      throw getBadRequestError("Not enough stock for product", {
        product: item.product,
        availableStock: product.countInStock,
      });
    }
  }
};

export const calculateTotalPrice = async (
  orderItems: string[],
  session: mongoose.ClientSession
): Promise<number> => {
  const totalPrice = await Promise.all(
    orderItems.map(async (orderItemId) => {
      const populatedOrderItem = await OrderItem.findById(orderItemId)
        .populate<{ product: IProduct }>("product", "price")
        .session(session);

      if (!populatedOrderItem || !populatedOrderItem.product) {
        throw getNotFoundError("Order item or product not found", {
          orderItemId: orderItemId,
        });
      }

      const price = populatedOrderItem.product.price;
      return price * populatedOrderItem.quantity;
    })
  );

  return totalPrice.reduce((a, b) => a + b, 0);
};

export const createOrderItems = async (
  orderItems: IOrderItem[],
  session: mongoose.ClientSession
): Promise<string[]> => {
  const orderItemsIds = await Promise.all(
    orderItems.map(async (orderItem) => {
      const newOrderItem = new OrderItem({
        product: orderItem.id,
        quantity: orderItem.quantity,
      });
      const savedOrderItem = await newOrderItem.save({ session });
      return savedOrderItem._id.toString();
    })
  );

  return orderItemsIds;
};

export const updateProductStock = async (
  orderItems: IOrderItem[],
  session: mongoose.ClientSession
): Promise<void> => {
  for (const item of orderItems) {
    const product = await Product.findById(item.id).session(session);

    if (!product) {
      throw getNotFoundError("Product not found", { productId: item.product });
    }

    product.countInStock -= item.quantity;

    // Save the updated product stock in the same transaction
    await product.save({ session });
  }
};

export const deleteOrderItems = async (orderItemsIds: IOrderItem[]) => {
  await OrderItem.deleteMany({ _id: { $in: orderItemsIds } });
};
