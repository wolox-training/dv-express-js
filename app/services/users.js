const jwt = require('jwt-simple');
const db = require('../models');
const errors = require('../errors');
const config = require('../../config').common.session;

const createUser = body =>
  db.User.newUser(body)
    .then(user => user)
    .catch(() => Promise.reject(errors.databaseError('The user could not be created.')));

const authenticate = async ({ email, password }) => {
  try {
    const { dataValues: user } = await db.User.findByCredentials(email, password);
    const token = await jwt.encode({ id: user.id.toString() }, config.secret);
    await db.Token.create({ userId: user.id, token });
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

const createAdmin = async body => {
  const { email } = body;
  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      const newUser = await db.User.newUser({ ...body, role: 'admin' });
      return newUser;
    }
    user.role = 'admin';
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

const logoutAll = userId =>
  db.Token.destroy({ where: { userId } })
    .then(response => response)
    .catch(() => Promise.reject(errors.databaseError('An error occurred while invalidating all sessions.')));

const getUser = async userId => {
  try {
    const user = await db.User.findOne({ where: { id: userId } });
    if (!user) {
      throw errors.databaseError('Some error occurred while get the user.');
    }
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = { createUser, authenticate, getUsers, createAdmin, getUser, logoutAll };
