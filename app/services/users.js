const jwt = require('jwt-simple');
const db = require('../models');
const errors = require('../errors');

const createUser = body =>
  db.User.newUser(body)
    .then(user => user)
    .catch(() => Promise.reject(errors.databaseError('The user could not be created.')));

const authenticate = async ({ email, password }) => {
  try {
    const { dataValues: user } = await db.User.findByCredentials(email, password);
    const token = await jwt.encode({ id: user.id.toString() }, process.env.JWT_SECRET);
    return { user: user.email, token };
  } catch (error) {
    throw error;
  }
};

const getUsers = async ({ limit = 5, page = 1 }) => {
  const offset = (page - 1) * limit;
  try {
    const data = await db.User.findAndCountAll({ limit, offset });
    const { count: totalUsers, rows: users } = data;
    const currentPage = page;
    const totalPages = Math.ceil(totalUsers / limit);
    return { totalUsers, users, totalPages, currentPage };
  } catch (error) {
    throw error;
  }
};

module.exports = { createUser, authenticate, getUsers };
