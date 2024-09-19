import mongoose, { Schema, Document } from "mongoose";
import { IOrderItem } from "./orderItemModel";
import { IUser } from "./userModel";

export interface IOrder extends Document {
  orderItems: IOrderItem[];
  shippingAddress1: string;
  shippingAddress2?: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
  status: string;
  totalPrice?: number;
  user: IUser;
  dateOrdered: Date;
}

const orderSchema: Schema = new Schema(
  {
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true,
      },
    ],
    shippingAddress1: {
      type: String,
      required: true,
    },
    shippingAddress2: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "Pending",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dateOrdered: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    versionKey: false,
  }
);

orderSchema.virtual("id").get(function (this: IOrder) {
  return this._id.toHexString();
});

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "orderItems",
    populate: {
      path: "product",
      select: "name price",
    },
  }).populate("user");
  next();
});

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
