const request = require('supertest');
const app = require('../app');

const loginNewUser = async loginUser => {
  await request(app)
    .post('/users')
    .send(loginUser);
  const { body } = await request(app)
    .post('/users/sessions')
    .send({
      email: loginUser.email,
      password: loginUser.password
    });
  return body;
};

module.exports = loginNewUser;
