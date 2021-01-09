const db = require('../models');
const errors = require('../errors');

const uniqueEmail = async (req, res, next) => {
  const registered = await db.User.findOne({ where: { email: req.body.email } });
  if (registered) {
    return next(errors.registeredEmailError('Email is already registered.'));
  }
  return next();
};

module.exports = uniqueEmail;
