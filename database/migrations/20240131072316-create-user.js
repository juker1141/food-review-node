"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
        is: /^[a-zA-Z\s]+$/i,
      },
      account: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
        len: [8, 20],
        is: /^[a-zA-Z0-9]+$/i,
      },
      userImage: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
        isEmail: true,
      },
      hashedPassword: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("users", ["account", "email"], {
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
