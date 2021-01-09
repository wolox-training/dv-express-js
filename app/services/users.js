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

const access = ({ email, password }) =>
  new Promise((resolve, reject) => {
    db.User.findByCredentials(email, password)
      .then(user => {
        resolve(user);
      })
      .catch(error => {
        reject(error);
      });
  });

module.exports = { createUser, access };
