import { Product } from "../models/product.model";
import { Category } from "../models/category.model";
import { AppError } from "../middleware/errorHandler";
import { Op } from "sequelize";

interface GetAllProductsOptions {
  page: number;
  limit: number;
  category?: string;
  search?: string;
}

export class ProductService {
  static async getAllProducts(options: GetAllProductsOptions) {
    const { page, limit, category, search } = options;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (category) {
      where.categoryId = category;
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [{ model: Category, as: "category" }],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      products: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  static async getProductById(id: string) {
    const product = await Product.findByPk(id, {
      include: [{ model: Category, as: "category" }],
    });
    if (!product) {
      throw new AppError(404, "Product not found");
    }
    return product;
  }

  static async createProduct(data: any) {
    const category = await Category.findByPk(data.categoryId);
    if (!category) {
      throw new AppError(404, "Category not found");
    }

    const product = await Product.create(data);
    return product;
  }

  static async updateProduct(id: string, data: any) {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new AppError(404, "Product not found");
    }

    if (data.categoryId) {
      const category = await Category.findByPk(data.categoryId);
      if (!category) {
        throw new AppError(404, "Category not found");
      }
    }

    await product.update(data);
    return product;
  }

  static async deleteProduct(id: string) {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new AppError(404, "Product not found");
    }

    await product.destroy();
  }

  static async getProductsByCategory(
    categoryId: string,
    options: { page: number; limit: number }
  ) {
    const { page, limit } = options;
    const offset = (page - 1) * limit;

    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new AppError(404, "Category not found");
    }

    const { count, rows } = await Product.findAndCountAll({
      where: { categoryId },
      include: [{ model: Category, as: "category" }],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      products: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }
}
