const request = require('supertest');

const app = require('../app');
const db = require('../app/models');
// const { factoryByModel } = require('./factory/factory_by_models');
const { createUser, buildUser } = require('./factory/users');

let user = '';

beforeEach(async () => {
  await db.User.destroy({ truncate: { cascade: true } });
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
      .expect(409);
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

describe('Post Sign In User', () => {
  test('Should not sign in nonexixtent user', async done => {
    const response = await request(app)
      .post('/users/sessions')
      .send({
        email: 'daniel.vega@wolox.co',
        password: 'password'
      });
    expect(response.status).toBe(401);
    expect(response.text).toContain('Unable to login');
    done();
  });

  test('Should not sign in empty params', async done => {
    const response = await request(app)
      .post('/users/sessions')
      .send({
        email: '',
        password: ''
      });
    expect(response.status).toBe(422);
    expect(response.text).toContain('empty');
    done();
  });

  test('Should not sign in with wrong password', async done => {
    const newUser = await createUser();
    const response = await request(app)
      .post('/users/sessions')
      .send({
        email: newUser.dataValues.email,
        password: 'asfe'
      });
    expect(response.status).toBe(401);
    expect(response.text).toContain('Unable to login');
    done();
  });

  test('Should not sign in email that does no belog wolox', async done => {
    const newUser = await createUser();
    const response = await request(app)
      .post('/users/sessions')
      .send({
        email: 'esteban.herrara@gmail.com',
        password: newUser.dataValues.password
      });
    expect(response.status).toBe(422);
    expect(response.text).toContain('wolox domain');
    done();
  });

  test('Should sign in user', async done => {
    await request(app)
      .post('/users')
      .send(user.dataValues);
    const response = await request(app)
      .post('/users/sessions')
      .send({
        email: user.dataValues.email,
        password: 'contrasena1234'
      });
    expect(response.text).toContain('token');
    expect(response.status).toBe(200);

    done();
  });
});
