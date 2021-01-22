const api = require('../../config/axios');
const db = require('../models');
const errors = require('../errors');

const fetchWeet = async () => {
  try {
    const { data } = await api.get('/random');
    if (!data) throw errors.withoutConnectionError('Could not connect with numbers api');
    if (data.length > 140) {
      throw errors.invalidWeetError('The content of the weet exceeds 140 characters. Try again.');
    }
    return data;
  } catch (error) {
    throw error;
  }
};

const createWeet = async (user, content) => {
  try {
    await db.Weet.create({ content, userId: user.id });
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
    const currentPage = page;
    const totalPages = Math.ceil(totalItems / limit);
    if (page > totalPages && totalPages > 0) {
      throw errors.badRequestError('Page requested exceed the total of pages.');
    }
    return { totalItems, weets, totalPages, currentPage };
  } catch (error) {
    throw error;
  }
};

const getWeet = async weetId => {
  try {
    const weet = await db.Weet.findOne({ where: { id: weetId } });
    if (!weet) {
      throw errors.notFoundError('Could not find the weet requested');
    }
    return weet;
  } catch (error) {
    throw error;
  }
};

const getUserWeets = async userId => {
  try {
    const userWeets = await db.Weet.findAll({
      where: { userId }
    });
    if (userWeets.length === 0) {
      throw errors.databaseError('Some error occurred while getting the weets.');
    }
    return userWeets;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  fetchWeet,
  readWeets,
  createWeet,
  getWeet,
  getUserWeets
};
