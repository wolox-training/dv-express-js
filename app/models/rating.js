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
        type: DataTypes.ENUM,
        values: [1, -1],
        allowNull: false
      }
    },
    {
      timestamps: false,
      underscored: true,
      tableName: 'rating-weets'
    }
  );
  return Rating;
};
