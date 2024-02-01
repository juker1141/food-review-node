import {
  DataTypes,
  Model,
  InferAttributes,
  CreationOptional,
  InferCreationAttributes,
} from "sequelize";
import { sequelize as sq } from "../config/db";

interface User
  extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  id: CreationOptional<number>;
  username: string;
  account: string;
  userImage: string;
  email: string;
  hashedPassword: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
}

const User = sq.define<User>("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      is: /^[a-zA-Z\s]+$/i,
    },
  },
  account: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
    validate: {
      len: [8, 20],
      is: /^[a-zA-Z0-9]+$/i,
    },
  },
  userImage: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  hashedPassword: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  createdAt: {
    allowNull: false,
    defaultValue: DataTypes.NOW,
    type: DataTypes.DATE,
  },
  updatedAt: {
    allowNull: false,
    defaultValue: DataTypes.NOW,
    type: DataTypes.DATE,
  },
});

export default User;
