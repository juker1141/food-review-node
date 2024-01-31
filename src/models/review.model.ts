import { DataTypes } from "sequelize";
import { sequelize as sq } from "../config/db";

import User from "@/models/user.model";

const Review = sq.define("review", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  shopTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shopUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stars: {
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
});

User.hasMany(Review);
Review.belongsTo(User, { foreignKey: "userId" });

Review.sync().then(() => {
  console.log("Review Model synced");
});

export default Review;
