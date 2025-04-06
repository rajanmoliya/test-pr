import { User } from "../models/user.model";
import { AppError } from "../middleware/errorHandler";
import { Op } from "sequelize";

interface GetAllUsersOptions {
  page: number;
  limit: number;
}

export class UserService {
  static async getAllUsers(options: GetAllUsersOptions) {
    const { page, limit } = options;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      attributes: { exclude: ["password"] },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      users: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  static async getUserById(id: string) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      throw new AppError(404, "User not found");
    }
    return user;
  }

  static async updateUser(id: string, data: any) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    // If email is being updated, check if it's already taken
    if (data.email && data.email !== user.email) {
      const existingUser = await User.findOne({
        where: { email: data.email, id: { [Op.ne]: id } },
      });
      if (existingUser) {
        throw new AppError(400, "Email already taken");
      }
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

  static async deleteUser(id: string) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    await user.destroy();
  }
}
