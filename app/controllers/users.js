const usersService = require('../services/users');

const signUp = async ({ body }, res) => {
  try {
    const user = await usersService.createUser(body);
    console.info(`username: ${user.email}`);
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

module.exports = { signUp };
