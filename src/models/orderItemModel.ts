import mongoose, { Schema, Document } from "mongoose";
import { IProduct } from "./productModel";

export interface IOrderItem extends Document {
  product: mongoose.Schema.Types.ObjectId;
  quantity: number;
}

const orderItemSchema: Schema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
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

orderItemSchema.virtual("id").get(function (this: IOrderItem) {
  return this._id.toHexString();
});

const OrderItem = mongoose.model<IOrderItem>("OrderItem", orderItemSchema);

export default OrderItem;
