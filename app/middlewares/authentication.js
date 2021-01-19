/* eslint-disable require-atomic-updates */

const jwt = require('jwt-simple');
const db = require('../models');
const errors = require('../errors');

const verifyAuthentication = async (req, _, next) => {
  try {
    const token = req.header('Authorization') || '';
    const activeToken = await db.Token.findOne({ where: { token } });
    if (!activeToken) throw Error();
    const decode = await jwt.decode(token, process.env.JWT_SECRET || '');
    const user = await db.User.findOne({ where: { id: decode.id } });
    req.user = user;
    return next();
  } catch (error) {
    return next(errors.wrongCredentialsError('Please sign in to access this module.'));
  }
};

module.exports = verifyAuthentication;
