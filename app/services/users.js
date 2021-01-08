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

module.exports = { createUser };
