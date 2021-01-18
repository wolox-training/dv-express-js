const jwt = require('jwt-simple');
const db = require('../models');
const errors = require('../errors');

const createUser = body =>
  db.User.newUser(body)
    .then(user => user)
    .catch(() => Promise.reject(errors.databaseError('The user could not be created.')));

const access = async ({ email, password }) => {
  try {
    const { dataValues: user } = await db.User.findByCredentials(email, password);
    const token = await jwt.encode({ userId: user.id.toString() }, process.env.JWT_SECRET);
    return Promise.resolve({ user: user.email, token });
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = { createUser, access };
