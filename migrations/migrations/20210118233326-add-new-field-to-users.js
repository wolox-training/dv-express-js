'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM,
      values: ['admin', 'user'],
      defaultValue: 'user'
    });
  },

  down: queryInterface => queryInterface.removeColumn('users', 'role')
};
