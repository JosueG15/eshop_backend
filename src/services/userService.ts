import User, { IUser } from "../models/userModel";
import bcrypt from "bcrypt";
import { GlobalFilters, GlobalQueryParams } from "../models/globalModels";

export class UserService {
  async createUser(userData: IUser): Promise<IUser> {
    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.passwordHash, salt);
    userData.passwordHash = hashedPassword;

    return await new User(userData).save();
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }

  async getAllUsers(
    filters: GlobalFilters,
    page: number,
    limit: number
  ): Promise<IUser[]> {
    const skip = (page - 1) * limit;
    return await User.find(filters).skip(skip).limit(limit).exec();
  }

  async updateUser(
    userId: string,
    userData: Partial<IUser>
  ): Promise<IUser | null> {
    const user = await User.findById(userId);
    if (!user) return null;

    if (userData.passwordHash) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.passwordHash, salt);
      userData.passwordHash = hashedPassword;
    }

    Object.assign(user, userData);
    return await user.save();
  }

  async deleteUser(userId: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(userId);
  }

  async getUserCount(filters: GlobalFilters): Promise<number> {
    return await User.countDocuments(filters).exec();
  }
}
