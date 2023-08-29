'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class post extends Model {

    static associate(models) {
      models.post.belongsTo(models.user, { foreignKey: "user_id", onDelete: "CASCADE" });
      models.post.hasMany(models.comment, { foreignKey: "post_id" });
      models.post.hasMany(models.vote, { foreignKey: "post_id" });
    }
  }

  post.init({
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    post_content: {
      type: DataTypes.STRING,
      allowNull: false
    },

    post_pictureURL: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "No picture"
    }

  }, {
    sequelize,
    modelName: 'post',
  });

  return post;
};