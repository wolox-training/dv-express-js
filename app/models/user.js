'use strict';

// const bcrypt = require('bcrypt');
const hashedPassword = require('../helpers/hashPassword');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      }
    },
    {
      timestamps: false,
      underscored: true,
      tableName: 'users'
    }
  );
  User.newUser = async data => {
    const user = User.create({
      ...data,
      password: await hashedPassword(data.password)
    });
    return user;
  };

  //   User.beforeCreate(async user => {
  //     const hashedPassword = await bcrypt.hashSync(user.password, Number(process.env.SALT));
  //     user.password = hashedPassword
  //   });

  return User;
};
