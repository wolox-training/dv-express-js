'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        allowNull: false
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      last_name: {
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
      freezeTableName: true,
      tableName: 'users'
    }
  );
  return User;
};

// const { DataTypes } = require('sequelize');
// const db = require('./index');

// const User = db.sequelize.define(
//   'User',
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       unique: true,
//       autoIncrement: true,
//       allowNull: false
//     },
//     first_name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         notEmpty: true
//       }
//     },
//     last_name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         notEmpty: true
//       }
//     },
//     email: {
//       type: DataTypes.STRING,
//       unique: true,
//       allowNull: false,
//       validate: {
//         notEmpty: true
//       }
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         notEmpty: true
//       }
//     }
//   },
//   {
//     timestamps: false,
//     freezeTableName: true,
//     tableName: 'users'
//   }
// );

// module.exports = User;
