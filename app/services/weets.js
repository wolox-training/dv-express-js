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

const readWeets = async ({ page = 1, limit = 5 }) => {
  const offset = (page - 1) * limit;
  try {
    const data = await db.Weet.findAndCountAll({ limit, offset });
    const { count: totalItems, rows: weets } = data;
    const currentPage = page;
    const totalPages = Math.ceil(totalItems / limit);
    if (page > totalPages) {
      return Promise.reject(errors.badRequestError('Page requested exceed the total of pages.'));
    }
    return Promise.resolve({ totalItems, weets, totalPages, currentPage });
  } catch (error) {
    return Promise.reject(errors.databaseError('Some error occurred while getting weets'));
  }
};

module.exports = {
  fetchWeet,
  readWeets
};
