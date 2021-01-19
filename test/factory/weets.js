const { factory } = require('factory-girl');
const faker = require('faker');

const db = require('../../app/models');
const { createUser } = require('./users');

const id = () => createUser().then(user => user.dataValues.id);

factory.define('Weet', db.Weet, {
  id: factory.sequence('weet.id', n => n),
  userId: id,
  content: faker.lorem.words(8)
});

exports.createWeet = () => factory.create('Weet');
exports.createManyWeets = () => factory.createMany('Weet', 4);
