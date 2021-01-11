const jwt = require('jwt-simple');
const db = require('../models');
const errors = require('../errors');

const auth = async (req, _, next) => {
  try {
    const token = req.header('Authorization');
    const decode = await jwt.decode(token, process.env.JWT_SECRET);
    await db.User.findOne({ where: { id: decode.id } });
    // const user = await db.User.findOne({ where: { id: decode.id } });
    // req.user = user;
    return next();
  } catch (error) {
    return next(errors.wrongCredentialsError('Please sign in to access this module.'));
  }
};

module.exports = auth;
