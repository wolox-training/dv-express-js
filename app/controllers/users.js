const usersService = require('../services/users');
const logger = require('../logger');

const signUp = async (req, res, next) => {
  try {
    const user = await usersService.createUser(req.body);
    logger.info(`username: ${user.email}`);
    return res.status(201).send(user);
  } catch (error) {
    return next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    const user = await usersService.access(req.body);
    res.status(200).send(user);
  } catch {
    next();
  }
};

module.exports = { signUp, signIn };
