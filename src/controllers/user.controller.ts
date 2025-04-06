import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { AppError } from "../middleware/errorHandler";

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const users = await UserService.getAllUsers({
        page: Number(page),
        limit: Number(limit),
      });
      res.json(users);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      res.json(user);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.updateUser(id, req.body);
      res.json(user);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await UserService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }
}
