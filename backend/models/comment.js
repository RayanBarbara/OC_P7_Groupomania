'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class comment extends Model {

    static associate(models) {
      models.comment.belongsTo(models.user, { foreignKey: "user_id", onDelete: "CASCADE" });
      models.comment.belongsTo(models.post, { foreignKey: "post_id", onDelete: "CASCADE" });
    }
  }

  comment.init({
    comment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    comment_content: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'comment',
  });

  return comment;
};