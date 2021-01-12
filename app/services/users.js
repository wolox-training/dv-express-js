const db = require('../models');

const createUser = body =>
  db.User.newUser(body)
    .then(user => user)
    .catch(error => error);

module.exports = { createUser };
