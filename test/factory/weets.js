const { factory } = require('factory-girl');
const faker = require('faker');

const db = require('../../app/models');

factory.define('Weet', db.Weet, {
  id: factory.sequence('weet.id', n => n),
  content: faker.lorem.words(8)
});

exports.createWeet = attrs => factory.create('Weet', attrs);
exports.createManyWeets = (numOfWeets, attrs) => factory.createMany('Weet', numOfWeets, attrs);
