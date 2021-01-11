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
    const token = await jwt.encode({ userId: user.id.toString() }, process.env.JWT_SECRET);
    return Promise.resolve({ user: user.email, token });
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = { createUser, access };
