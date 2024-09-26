import User, { IUser } from "../models/userModel";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../helpers/jwtHelper";
import redis from "../config/redisClient";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../models/jwtModel";

export class AuthService {
  async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const token = this.generateAccessToken(user.id, user.isAdmin);
    return { token, user };
  }

  async register(data: Partial<IUser>) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(data.passwordHash as string, 10);
    const newUser = new User({
      ...data,
      passwordHash: hashedPassword,
      isAdmin: false,
    });

    await newUser.save();

    const token = this.generateAccessToken(newUser.id, newUser.isAdmin);
    return { token, user: newUser };
  }

  private generateAccessToken(userId: string, isAdmin: boolean) {
    const payload: JwtPayload = { userId, isAdmin };
    return generateToken(payload, process.env.JWT_EXPIRES_IN || "1h");
  }

  async logout(token: string) {
    const decoded = verifyToken(token) as jwt.JwtPayload;

    const timeToExpire = decoded.exp! - Math.floor(Date.now() / 1000);
    if (timeToExpire > 0) {
      await redis.set(token, "blacklisted", "EX", timeToExpire);
    }

    return { message: "User logged out successfully" };
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const isBlacklisted = await redis.get(token);
    return isBlacklisted !== null;
  }
}
