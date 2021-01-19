'use strict';

module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define(
    'Rating',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      ratingUserId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      weetId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      timestamps: false,
      underscored: true,
      tableName: 'ratings'
    }
  );
  return Rating;
};