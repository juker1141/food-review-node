import {
  DataTypes,
  Model,
  InferAttributes,
  CreationOptional,
  InferCreationAttributes,
} from "sequelize";
import { sequelize as sq } from "../config/db";

interface Shop
  extends Model<InferAttributes<Shop>, InferCreationAttributes<Shop>> {
  id: CreationOptional<number>;
  title: string;
  url: string;
  imageUrl: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
}

const Shop = sq.define<Shop>("shop", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
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

export default Shop;
