'use strict';

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-') +
    ' ' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(':')
  );
}

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

      lastVisitDate: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: formatDate(new Date('January 01, 1970 00:00:00'))
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