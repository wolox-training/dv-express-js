const { factory } = require('factory-girl');
const faker = require('faker');

const db = require('../../app/models');

factory.define('User', db.User, {
  id: factory.sequence('user.id', n => n),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: factory.sequence('user.email', n => `${faker.internet.userName().toLowerCase()}${n}@wolox.com`),
  password: faker.internet.password(10, false, /[0-9A-Z]/)
});

exports.buildUser = () => factory.build('User');
exports.createUser = () => factory.create('User');
exports.createMany = () => factory.createMany('User', 5);
exports.attributes = () => factory.attrs('User');
