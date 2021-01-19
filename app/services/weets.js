const api = require('../../config/axios');
const db = require('../models');
const errors = require('../errors');

const fetchWeet = async () => {
  try {
    const { data } = await api.get('/random');
    if (!data) throw errors.databaseError('Could not connect with external api');
    if (data.length > 140) {
      throw errors.defaultError('The content of the weet exceeds 140 characters. Try again.');
    }
    return data;
  } catch (error) {
    throw error;
  }
};

const createWeet = async (user, content) => {
  try {
    await db.Weet.create({ userId: user.id, content });
    return { user: user.email, content };
  } catch (error) {
    throw errors.databaseError('Weet could not be created in database.');
  }
};

module.exports = {
  fetchWeet,
  createWeet
};
