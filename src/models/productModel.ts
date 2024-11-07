import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  richDescription?: string;
  image?: string;
  images?: Array<string>;
  brand?: string;
  price: number;
  category: ObjectId;
  countInStock: number;
  rating?: number;
  numReviews?: number;
  isFeatured?: boolean;
  dateCreated?: Date;
}

const productSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    richDescription: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    brand: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    countInStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

productSchema.virtual("id").get(function (this: IProduct) {
  return this._id.toHexString();
});

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
