const jwt = require('jwt-simple');
const db = require('../models');

const createUser = body =>
  new Promise((resolve, reject) => {
    db.User.newUser(body)
      .then(user => {
        resolve(user);
      })
      .catch(error => {
        reject(error);
      });
  });

const access = async ({ email, password }) => {
  try {
    const { dataValues: user } = await db.User.findByCredentials(email, password);
    const token = await jwt.encode({ id: user.id.toString() }, process.env.JWT_SECRET);
    return Promise.resolve({ user: user.email, token });
  } catch (error) {
    return Promise.reject(error);
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

module.exports = { createUser, access, getUsers };
