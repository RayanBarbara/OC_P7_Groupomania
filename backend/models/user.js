'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class user extends Model {

    static associate(models) {
      models.user.hasMany(models.post, { foreignKey: "user_id" });
      models.user.hasMany(models.comment, { foreignKey: "user_id" });
      models.user.hasMany(models.vote, { foreignKey: "user_id" });
    }
  }

  user.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },

    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      isEmail: true
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    user_pictureURL: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "BasicFrontEndAvatar"
    },

    user_description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Write your description here!"
    }
  }, {
    sequelize,
    modelName: 'user',
  });

  return user;
};