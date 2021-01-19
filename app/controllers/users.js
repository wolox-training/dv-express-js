const usersService = require('../services/users');
const logger = require('../logger');
const errors = require('../errors');

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
    const user = await usersService.authenticate(req.body);
    return res.status(200).send(user);
  } catch (error) {
    return next(error);
  }
};

const getUsersList = async (req, res, next) => {
  try {
    const users = await usersService.getUsers(req.query);
    return res.status(200).send(users);
  } catch (error) {
    return next(error);
  }
};

const postAdmin = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(errors.forbidenModuleError('You have no access to this module.'));
  }
  try {
    const user = await usersService.createAdmin(req.body);
    return res.status(201).send(user);
  } catch (error) {
    return next(error);
  }
};

module.exports = { signUp, signIn, getUsersList, postAdmin };
