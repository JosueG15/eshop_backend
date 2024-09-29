import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  address: string;
  address2?: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
  isAdmin: boolean;
  avatar?: string;
}

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    address2: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    zip: {
      type: String,
      trim: true,
      default: "",
    },
    country: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    avatar: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

userSchema.virtual("id").get(function (this: IUser) {
  return this._id.toHexString();
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
