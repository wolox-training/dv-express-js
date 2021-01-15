'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ratings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      ratingUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      weetId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'weets-user',
          key: 'id'
        }
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  },

  down: queryInterface => queryInterface.dropTable('ratings')
};
