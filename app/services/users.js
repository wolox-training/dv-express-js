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
    const token = await jwt.encode({ userId: user.id.toString() }, process.env.JWT_SECRET);
    return { user: user.email, token };
  } catch (error) {
    throw error;
  }
};

module.exports = { createUser, authenticate };
