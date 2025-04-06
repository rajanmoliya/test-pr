import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma";
import { config } from "../config";
import { AppError } from "../middleware/errorHandler";
import { sendEmail } from "../utils/email";
import { generateToken } from "../utils/token";
import { User } from "../models/user.model";
import { compare } from "bcryptjs";

export class AuthService {
  static async register(userData: any) {
    const existingUser = await User.findOne({
      where: { email: userData.email },
    });
    if (existingUser) {
      throw new AppError(400, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await User.create({
      ...userData,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user.id }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError(401, "Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, "Invalid credentials");
    }

    const token = jwt.sign({ id: user.id }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    };
  }

  static async verifyEmail(token: string) {
    // Implementation for email verification
    throw new AppError(501, "Not implemented");
  }

  static async forgotPassword(email: string) {
    // Implementation for forgot password
    throw new AppError(501, "Not implemented");
  }

  static async resetPassword(token: string, password: string) {
    // Implementation for reset password
    throw new AppError(501, "Not implemented");
  }

  static async updateProfile(userId: string, data: any) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    await user.update(data);
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }

  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new AppError(401, "Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    return { message: "Password updated successfully" };
  }
}
