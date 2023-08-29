'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class vote extends Model {

    static associate(models) {
      models.vote.belongsTo(models.user, { foreignKey: "user_id", onDelete: "CASCADE" });
      models.vote.belongsTo(models.post, { foreignKey: "post_id", onDelete: "CASCADE" });
    }
  }

  vote.init({
    vote_id: {
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

    vote: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'vote',
  });

  return vote;
};