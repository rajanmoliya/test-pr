import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export class Category extends Model {
  public id!: string;
  public name!: string;
  public description!: string;
  public parentId!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "categories",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "categories",
  }
);

// Define self-referential association
Category.belongsTo(Category, { foreignKey: "parentId", as: "parent" });
Category.hasMany(Category, { foreignKey: "parentId", as: "subcategories" });
