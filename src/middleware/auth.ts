import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
<<<<<<< HEAD
import { config } from "../config/config";
import { User } from "../models/user.model";
import { AppError } from "./errorHandler";

interface JwtPayload {
  userId: string;
  role: string;
}
=======
import { AppError } from "./errorHandler";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
>>>>>>> fa348557fcf99f2ce03f13fa6388d3979e6e1240

declare global {
  namespace Express {
    interface Request {
<<<<<<< HEAD
      user?: User;
=======
      user?: {
        id: string;
        email: string;
        role: string;
      };
>>>>>>> fa348557fcf99f2ce03f13fa6388d3979e6e1240
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
<<<<<<< HEAD
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError(401, "Authentication required");
    }

    const decoded = jwt.verify(token, config.jwt.secret) as { id: string };
    const user = await User.findByPk(decoded.id);
=======
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError(401, "No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true },
    });
>>>>>>> fa348557fcf99f2ce03f13fa6388d3979e6e1240

    if (!user) {
      throw new AppError(401, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(401, "Invalid token"));
<<<<<<< HEAD
    } else {
      next(error);
    }
=======
      return;
    }
    next(error);
>>>>>>> fa348557fcf99f2ce03f13fa6388d3979e6e1240
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
<<<<<<< HEAD
      throw new AppError(401, "Authentication required");
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(403, "Insufficient permissions");
=======
      return next(new AppError(401, "Not authenticated"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, "Not authorized"));
>>>>>>> fa348557fcf99f2ce03f13fa6388d3979e6e1240
    }

    next();
  };
};
