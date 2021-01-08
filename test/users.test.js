const request = require('supertest');

const app = require('../app');
// const { factoryByModel } = require('./factory/factory_by_models');
const { createUser, buildUser } = require('./factory/users');

let user = '';

beforeEach(async () => {
  user = await buildUser();
});

describe('Post Sign UP', () => {
  test('Should sign up a new user', async done => {
    // const user = await factoryByModel('User');
    const response = await request(app)
      .post('/users')
      .send(user.dataValues);
    expect(response.text).toContain('esteban.herrera');
    done();
  });

  test('Should fail for invalid password', async done => {
    const invalidPassword = { ...user.dataValues, password: 'contra12*' };
    const response = await request(app)
      .post('/users')
      .send(invalidPassword)
      .expect(422);
    expect(response.text).toContain('password');
    done();
  });

  test('Should fail for email in use', async done => {
    await createUser();
    const response = await request(app)
      .post('/users')
      .send(user.dataValues)
      .expect(422);
    expect(response.text).toContain('Email is already');
    done();
  });

  test('Should fail for empty parameters', async done => {
    const response = await request(app)
      .post('/users')
      .send()
      .expect(422);
    expect(response.text).toContain('empty');
    done();
  });
});
