import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  color?: string;
  icon?: string;
  image?: string;
}

const categorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
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
  }
);

categorySchema.virtual("id").get(function (this: ICategory) {
  return this._id.toHexString();
});

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
