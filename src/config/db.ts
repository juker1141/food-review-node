import { Sequelize } from "sequelize";

const env = process.env.NODE_ENV || "development";
const configFile = require("../../database/config/config");
const config = configFile[env];

export const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

export const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
