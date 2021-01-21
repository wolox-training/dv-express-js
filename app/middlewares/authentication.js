/* eslint-disable require-atomic-updates */

const jwt = require('jwt-simple');
const db = require('../models');
const errors = require('../errors');
const config = require('../../config').common.session;

const verifyAuthentication = async (req, _, next) => {
  try {
    const token = req.header('Authorization');
    const activeToken = await db.Token.findOne({ where: { token } });
    if (!activeToken) throw Error();
    const decoded = await jwt.decode(token, config.secret);
    const user = await db.User.findOne({ where: { id: decoded.id } });
    req.user = user;
    return next();
  } catch (error) {
    return next(errors.unauthenticatedError('Please sign in to access this module.'));
  }
};

module.exports = verifyAuthentication;
