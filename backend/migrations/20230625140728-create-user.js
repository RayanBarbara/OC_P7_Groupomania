'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        onDelete: "CASCADE",
        type: Sequelize.INTEGER
      },

      firstName: {
        allowNull: false,
        type: Sequelize.STRING
      },

      lastName: {
        allowNull: false,
        type: Sequelize.STRING
      },

      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },

      password: {
        allowNull: false,
        type: Sequelize.STRING
      },

      isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },

      user_pictureURL: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: "BasicFrontEndAvatar"
      },

      user_description: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: "Write your description here!"
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};