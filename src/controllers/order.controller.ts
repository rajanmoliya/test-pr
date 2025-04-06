import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { AppError } from "../middleware/errorHandler";

export class OrderController {
  async getAllOrders(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const orders = await OrderService.getAllOrders({
        page: Number(page),
        limit: Number(limit),
        status: status as string,
      });
      res.json(orders);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  async getOrderById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderById(id);
      res.json(order);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  async getUserOrders(req: Request, res: Response) {
    try {
      if (!req.user) {
        throw new AppError(401, "Authentication required");
      }
      const { page = 1, limit = 10, status } = req.query;
      const orders = await OrderService.getUserOrders(req.user.id, {
        page: Number(page),
        limit: Number(limit),
        status: status as string,
      });
      res.json(orders);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  async createOrder(req: Request, res: Response) {
    try {
      if (!req.user) {
        throw new AppError(401, "Authentication required");
      }
      const order = await OrderService.createOrder(req.user.id, req.body);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  async updateOrderStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await OrderService.updateOrderStatus(id, status);
      res.json(order);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }
}
