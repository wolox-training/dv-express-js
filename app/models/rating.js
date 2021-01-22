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
        allowNull: false,
        validate: {
          min: -1,
          max: 1,
          not: 0
        }
      }
    },
    {
      timestamps: false,
      underscored: true,
      tableName: 'ratings'
    }
  );
  Rating.associate = models => {
    Rating.belongsTo(models.User, {
      foreingKey: 'ratingUserId'
    });
    Rating.belongsTo(models.Weet, {
      foreingKey: 'weetId'
    });
  };
  return Rating;
};
