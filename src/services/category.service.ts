import { Category } from "../models/category.model";
import { AppError } from "../middleware/errorHandler";

export class CategoryService {
  static async getAllCategories() {
    const categories = await Category.findAll({
      order: [["name", "ASC"]],
    });
    return categories;
  }

  static async getCategoryById(id: string) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new AppError(404, "Category not found");
    }
    return category;
  }

  static async createCategory(data: any) {
    // If parentId is provided, check if parent category exists
    if (data.parentId) {
      const parentCategory = await Category.findByPk(data.parentId);
      if (!parentCategory) {
        throw new AppError(404, "Parent category not found");
      }
    }

    const category = await Category.create(data);
    return category;
  }

  static async updateCategory(id: string, data: any) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new AppError(404, "Category not found");
    }

    // If parentId is being updated, check if parent category exists
    if (data.parentId && data.parentId !== category.parentId) {
      const parentCategory = await Category.findByPk(data.parentId);
      if (!parentCategory) {
        throw new AppError(404, "Parent category not found");
      }
    }

    await category.update(data);
    return category;
  }

  static async deleteCategory(id: string) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new AppError(404, "Category not found");
    }

    // Check if category has any subcategories
    const subcategories = await Category.count({
      where: { parentId: id },
    });
    if (subcategories > 0) {
      throw new AppError(400, "Cannot delete category with subcategories");
    }

    await category.destroy();
  }
}
