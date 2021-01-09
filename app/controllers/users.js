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

module.exports = { signUp };
