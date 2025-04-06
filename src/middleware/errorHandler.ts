import { Request, Response, NextFunction } from "express";
<<<<<<< HEAD
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { logger } from "../utils/logger";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
=======
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(public statusCode: number, public message: string) {
>>>>>>> fa348557fcf99f2ce03f13fa6388d3979e6e1240
    super(message);
    this.name = "AppError";
  }
}

export const errorHandler = (
<<<<<<< HEAD
  err: Error,
=======
  err: Error | ZodError,
>>>>>>> fa348557fcf99f2ce03f13fa6388d3979e6e1240
  req: Request,
  res: Response,
  next: NextFunction
) => {
<<<<<<< HEAD
  logger.error(err);
=======
  console.error(err);
>>>>>>> fa348557fcf99f2ce03f13fa6388d3979e6e1240

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
<<<<<<< HEAD
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
=======
>>>>>>> fa348557fcf99f2ce03f13fa6388d3979e6e1240
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "error",
<<<<<<< HEAD
      message: "Validation error",
=======
      message: "Validation failed",
>>>>>>> fa348557fcf99f2ce03f13fa6388d3979e6e1240
      errors: err.errors,
    });
  }

<<<<<<< HEAD
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle specific Prisma errors
    switch (err.code) {
      case "P2002":
        return res.status(409).json({
          status: "error",
          message: "Unique constraint violation",
        });
      case "P2025":
        return res.status(404).json({
          status: "error",
          message: "Record not found",
        });
      default:
        return res.status(500).json({
          status: "error",
          message: "Database error",
        });
    }
  }

  // Handle Sequelize errors
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }

  // Default error
  return res.status(500).json({
    status: "error",
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
=======
  return res.status(500).json({
    status: "error",
    message: "Internal server error",
>>>>>>> fa348557fcf99f2ce03f13fa6388d3979e6e1240
  });
};
