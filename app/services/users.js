const db = require('../models');

const createUser = body =>
  new Promise((resolve, reject) => {
    db.User.create(body)
      .then(({ dataValues }) => {
        resolve(dataValues);
      })
      .catch(error => {
        console.error(error);
        reject(error);
      });
  });

module.exports = { createUser };
