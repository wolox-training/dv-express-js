const api = require('../../config/axios');
const db = require('../models');
const errors = require('../errors');

const fetchWeet = async user => {
  try {
    const { data } = await api.get('/random');
    if (data.length > 140) {
      return Promise.reject(
        errors.defaultError('The content of the weet exceeds 140 characters. Try again.')
      );
    }
    const created = await db.Weet.create({ userId: user.id, content: data });
    if (!created) {
      return Promise.reject(errors.databaseError('Weet could not be created in database.'));
    }
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(errors.databaseError('Could not establish connection with the api'));
  }
};

module.exports = {
  fetchWeet
};
