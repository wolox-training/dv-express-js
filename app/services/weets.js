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

const readWeets = async ({ page = 1, limit = 5 }) => {
  const offset = (page - 1) * limit;
  try {
    const { count: totalItems, rows: weets } = await db.Weet.findAndCountAll({
      limit,
      offset,
      attributes: {
        exclude: ['UserId']
      }
    });
    if (!weets) throw errors.databaseError('Some error occurred while getting weets');
    if (totalItems === 0) {
      return { noWeets: 'There are no weets to show.' };
    }
    const currentPage = page;
    const totalPages = Math.ceil(totalItems / limit);
    if (page > totalPages) {
      throw errors.badRequestError('Page requested exceed the total of pages.');
    }
    return { totalItems, weets, totalPages, currentPage };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  fetchWeet,
  readWeets,
  createWeet
};
