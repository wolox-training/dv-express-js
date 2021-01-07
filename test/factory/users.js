const { factory } = require('factory-girl');

const db = require('../../app/models');

factory.define('User', db.User, {
  firstName: 'Esteban',
  lastName: 'Herrera',
  email: 'esteban.herrera@wolox.co',
  password: 'contrasena1234'
});

exports.buildUser = () => factory.build('User');
exports.createUser = () => factory.create('User');
