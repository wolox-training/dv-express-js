'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'position', {
      type: Sequelize.ENUM,
      values: ['Developer', 'Lead', 'TL', 'EM', 'HEAD', 'CEO'],
      defaultValue: 'Developer'
    });
  },

  down: queryInterface => queryInterface.removeColumn('users', 'position')
};
