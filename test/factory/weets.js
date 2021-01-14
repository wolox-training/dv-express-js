const { factory } = require('factory-girl');

const db = require('../../app/models');

factory.define('Weet', db.Weet, {
  userId: 1,
  content: 'fake weet'
});

exports.createWeet = () => factory.create('Weet');
