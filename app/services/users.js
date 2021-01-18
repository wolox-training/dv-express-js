const jwt = require('jwt-simple');
const db = require('../models');
const errors = require('../errors');

const createUser = body =>
  db.User.newUser(body)
    .then(user => user)
    .catch(() => Promise.reject(errors.databaseError('The user could not be created.')));

const autheticate = async ({ email, password }) => {
  try {
    const { dataValues: user } = await db.User.findByCredentials(email, password);
    const token = await jwt.encode({ id: user.id.toString() }, process.env.JWT_SECRET);
    return { user: user.email, token };
  } catch (error) {
    throw error;
  }
};

const getUsers = async ({ limit = 10, offset = 0 }) => {
  try {
    const users = await db.User.findAll({ limit, offset });
    return Promise.resolve(users);
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = { createUser, autheticate, getUsers };
