const db = require('../models');

const createUser = body => {
  db.User.create(body)
    .then(user => user)
    .catch(error => {
      console.error(error);
      Promise.reject(error);
    });
};

module.exports = { createUser };
