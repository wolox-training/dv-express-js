const db = require('../models');
const errors = require('../errors');

const checkIfEmailExists = async (req, _, next) => {
  const registered = await db.User.findOne({ where: { email: req.body.email } });
  if (registered) {
    return next(errors.registeredEmailError('Email is already registered.'));
  }
  return next();
};

module.exports = checkIfEmailExists;
