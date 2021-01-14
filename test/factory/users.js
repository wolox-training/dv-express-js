const { factory } = require('factory-girl');
const faker = require('faker');

const db = require('../../app/models');

factory.define('User', db.User, {
  id: factory.sequence('user.id', n => n),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  // email: `${faker.name.firstName()}.${faker.name.lastName()}@wolox.com`,
  email: 'esteban.herrera@wolox.co',
  password: 'contrasena1234'
});

exports.buildUser = () => factory.build('User');
exports.createUser = () => factory.create('User');
