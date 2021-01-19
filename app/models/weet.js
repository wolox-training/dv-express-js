'use strict';

module.exports = (sequelize, DataTypes) => {
  const Weet = sequelize.define(
    'Weet',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      timestamps: false,
      underscored: true,
      tableName: 'weets-user'
    }
  );
  Weet.associate = models => {
    Weet.belongsTo(models.User);
  };
  return Weet;
};
