import { prisma } from "../utils/prisma";
import { AppError } from "../middleware/errorHandler";
import { ProductService } from "./product.service";
import { z } from "zod";
import { Order } from "../models/order.model";
import { OrderItem } from "../models/order-item.model";
import { Product } from "../models/product.model";
import { Op } from "sequelize";

const orderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema),
  addressId: z.string().uuid(),
});

interface GetAllOrdersOptions {
  page: number;
  limit: number;
  status?: string;
}

export class OrderService {
  static async create(userId: string, data: z.infer<typeof createOrderSchema>) {
    const validatedData = createOrderSchema.parse(data);

    // Verify address belongs to user
    const address = await prisma.address.findUnique({
      where: { id: validatedData.addressId },
    });

    if (!address || address.userId !== userId) {
      throw new AppError(404, "Address not found");
    }

    // Calculate total and verify stock
    let total = 0;
    const orderItems = [];

    for (const item of validatedData.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new AppError(404, `Product not found: ${item.productId}`);
      }

      if (product.stock < item.quantity) {
        throw new AppError(
          400,
          `Insufficient stock for product: ${product.name}`
        );
      }

      total += product.price * item.quantity;
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        status: "PENDING",
        total,
        addressId: validatedData.addressId,
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        address: true,
      },
    });

    // Update stock
    for (const item of validatedData.items) {
      await ProductService.updateStock(item.productId, -item.quantity);
    }

    return order;
  }

  static async findAll(
    userId: string,
    query: {
      page?: number;
      limit?: number;
      status?: string;
    }
  ) {
    const { page = 1, limit = 10, status } = query;

    const where = {
      userId,
      ...(status && { status }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          address: true,
          payment: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async findById(userId: string, id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        address: true,
        payment: true,
      },
    });

    if (!order) {
      throw new AppError(404, "Order not found");
    }

    if (order.userId !== userId) {
      throw new AppError(403, "Not authorized to view this order");
    }

    return order;
  }

  static async updateStatus(id: string, status: string) {
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new AppError(404, "Order not found");
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        address: true,
        payment: true,
      },
    });

    return updatedOrder;
  }

  static async cancelOrder(userId: string, id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      throw new AppError(404, "Order not found");
    }

    if (order.userId !== userId) {
      throw new AppError(403, "Not authorized to cancel this order");
    }

    if (order.status !== "PENDING") {
      throw new AppError(400, "Cannot cancel order in current status");
    }

    // Update order status
    await prisma.order.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    // Restore stock
    for (const item of order.orderItems) {
      await ProductService.updateStock(item.productId, item.quantity);
    }

    return { message: "Order cancelled successfully" };
  }

  static async processPayment(
    orderId: string,
    paymentData: {
      amount: number;
      currency: string;
      provider: string;
      paymentMethod: string;
    }
  ) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new AppError(404, "Order not found");
    }

    if (order.status !== "PENDING") {
      throw new AppError(400, "Order is not in pending status");
    }

    if (order.total !== paymentData.amount) {
      throw new AppError(400, "Payment amount does not match order total");
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        ...paymentData,
        status: "COMPLETED",
      },
    });

    // Update order with payment
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PROCESSING",
        paymentId: payment.id,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        address: true,
        payment: true,
      },
    });

    return updatedOrder;
  }

  static async getAllOrders(options: GetAllOrdersOptions) {
    const { page, limit, status } = options;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      orders: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  static async getOrderById(id: string) {
    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });
    if (!order) {
      throw new AppError(404, "Order not found");
    }
    return order;
  }

  static async getUserOrders(
    userId: string,
    options: { page: number; limit: number; status?: string }
  ) {
    const { page, limit, status } = options;
    const offset = (page - 1) * limit;

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      orders: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  static async createOrder(userId: string, data: any) {
    const { items, addressId } = data;

    // Check if all products exist and have sufficient stock
    const productIds = items.map((item: any) => item.productId);
    const products = await Product.findAll({
      where: { id: { [Op.in]: productIds } },
    });

    if (products.length !== productIds.length) {
      throw new AppError(404, "One or more products not found");
    }

    // Check stock and calculate total
    let total = 0;
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;

      if (product.stock < item.quantity) {
        throw new AppError(
          400,
          `Insufficient stock for product: ${product.name}`
        );
      }

      total += product.price * item.quantity;
    }

    // Create order
    const order = await Order.create({
      userId,
      addressId,
      total,
      status: "PENDING",
    });

    // Create order items and update product stock
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;

      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });

      await product.update({
        stock: product.stock - item.quantity,
      });
    }

    return order;
  }

  static async updateOrderStatus(id: string, status: string) {
    const order = await Order.findByPk(id);
    if (!order) {
      throw new AppError(404, "Order not found");
    }

    await order.update({ status });
    return order;
  }
}
