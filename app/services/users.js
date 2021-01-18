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

const getUsers = async ({ limit = 10, page = 0 }) => {
  const offset = page * limit;
  try {
    const users = await db.User.findAll({ limit, offset });
    return Promise.resolve(users);
  } catch (error) {
    return Promise.reject(error);
  }
};

const createAdmin = async body => {
  const { email } = body;
  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      const newUser = await db.User.newUser({ ...body, role: 'admin' });
      return Promise.resolve(newUser);
    }
    user.role = 'admin';
    await user.save();
    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = { createUser, authenticate, getUsers, createAdmin };
