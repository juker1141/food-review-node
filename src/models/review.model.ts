import {
  DataTypes,
  Model,
  InferAttributes,
  CreationOptional,
  InferCreationAttributes,
} from "sequelize";
import { sequelize as sq } from "../config/db";

import User from "../models/user.model";
import Shop from "../models/shop.model";

interface Review
  extends Model<InferAttributes<Review>, InferCreationAttributes<Review>> {
  id: CreationOptional<number>;
  userId: number;
  shopId: number;
  rating: number;
  imageUrl: string;
  title: string;
  content: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
}

const Review = sq.define<Review>("review", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: "users",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  shopId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: "shops",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

User.hasMany(Review);
Shop.hasMany(Review);
Review.belongsTo(User, { foreignKey: "userId" });
Review.belongsTo(Shop, { foreignKey: "shopId" });

export default Review;
