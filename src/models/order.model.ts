import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import { User } from "./user.model";
import { OrderItem } from "./order-item.model";

export class Order extends Model {
  public id!: string;
  public userId!: string;
  public addressId!: string;
  public total!: number;
  public status!:
    | "PENDING"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    addressId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM(
        "PENDING",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED"
      ),
      defaultValue: "PENDING",
    },
  },
  {
    sequelize,
    modelName: "Order",
    tableName: "orders",
  }
);

// Define associations
Order.belongsTo(User, { foreignKey: "userId", as: "user" });
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
