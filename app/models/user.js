'use strict';

const bcrypt = require('bcrypt');
const errors = require('../errors');
const hashString = require('../helpers/hashString');

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
      },
      role: {
        type: DataTypes.ENUM,
        values: ['admin', 'user'],
        defaultValue: 'user'
      },
      position: {
        type: DataTypes.ENUM,
        values: ['Developer', 'Lead', 'TL', 'EM', 'HEAD', 'CEO'],
        defaultValue: 'Developer'
      }
    },
    {
      timestamps: false,
      underscored: true,
      tableName: 'users'
    }
  );

  User.associate = models => {
    User.hasMany(models.Weet);
    User.hasMany(models.Rating);
  };

  User.newUser = async data => {
    const user = User.create({
      ...data,
      password: await hashString(data.password)
    });
    return user;
  };

  User.setPosition = async (user, points) => {
    let position = '';
    if (points <= 5) position = 'Developer';
    else if (points <= 9) position = 'Lead';
    else if (points <= 19) position = 'TL';
    else if (points <= 29) position = 'EM';
    else if (points <= 49) position = 'HEAD';
    else position = 'CEO';

    user.position = position;
    await user.save();
  };

  User.findByCredentials = async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw errors.wrongCredentialsError('Unable to login.');
  };

  return User;
};
