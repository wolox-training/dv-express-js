const request = require('supertest');

const app = require('../app');
// const { factoryByModel } = require('./factory/factory_by_models');
const { createUser, createMany, attributes } = require('./factory/users');

let user = '';

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

beforeEach(async () => {
  user = await attributes();
});

describe('Post Sign Up', () => {
  test('Should sign up a new user', async done => {
    // const user = await factoryByModel('User');
    const response = await request(app)
      .post('/users')
      .send(user);
    expect(response.status).toBe(201);
    expect(response.body.email).toBe(user.email);
    done();
  });

  test('Should fail for invalid password', async done => {
    const invalidPassword = { ...user, password: 'contra12*' };
    const response = await request(app)
      .post('/users')
      .send(invalidPassword);
    expect(response.status).toBe(422);
    expect(response.body.internal_code).toBe('schema_validation_error');
    expect(response.body.message.password.msg).toEqual('Password must be alphanumeric.');
    done();
  });

  test('Should fail for email in use', async done => {
    const newUser = await createUser();
    const response = await request(app)
      .post('/users')
      .send(newUser.dataValues);
    expect(response.status).toBe(409);
    expect(response.body.internal_code).toBe('registered_email_error');
    expect(response.body.message).toBe('Email is already registered.');
    done();
  });

  test('Should fail for empty parameters', async done => {
    const response = await request(app)
      .post('/users')
      .send();
    expect(response.status).toBe(422);
    expect(response.body.internal_code).toBe('schema_validation_error');
    expect(response.body.message.firstName.msg).toBe('First name cannot be empty!');
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
    expect(response.body.internal_code).toBe('wrong_credentials_error');
    expect(response.body.message).toBe('Unable to login.');
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
    expect(response.body.internal_code).toBe('schema_validation_error');
    expect(response.body.message.password.msg).toBe('Password cannot be empty!');
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
    expect(response.body.internal_code).toBe('wrong_credentials_error');
    expect(response.body.message).toBe('Unable to login.');
    done();
  });

  test('Should not sign in email that does not belong wolox', async done => {
    const newUser = await createUser();
    const response = await request(app)
      .post('/users/sessions')
      .send({
        email: 'esteban.herrara@gmail.com',
        password: newUser.dataValues.password
      });
    expect(response.status).toBe(422);
    expect(response.body.internal_code).toBe('schema_validation_error');
    expect(response.body.message.email.msg).toBe('Email does not belong wolox domain.');
    done();
  });

  test('Should sign in user', async done => {
    await request(app)
      .post('/users')
      .send(user);
    const response = await request(app)
      .post('/users/sessions')
      .send({
        email: user.email,
        password: user.password
      });
    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();

    done();
  });
});

describe('Get Users', () => {
  test('Should fail for unauthenticated user', async done => {
    const response = await request(app)
      .get('/users')
      .send();
    expect(response.status).toBe(401);
    expect(response.body.internal_code).toBe('unauthenticated_error');
    expect(response.body.message).toBe('Please sign in to access this module.');
    done();
  });

  test('Should work for authenticated user', async done => {
    const body = await loginNewUser(user);
    const response = await request(app)
      .get('/users')
      .set('Authorization', `${body.token}`)
      .send();
    expect(response.status).toBe(200);
    expect(response.body.users).toBeTruthy();
    done();
  });

  test('Should fail for wrong query params', async done => {
    const body = await loginNewUser(user);
    const response = await request(app)
      .get('/users')
      .query({ page: 'primera' })
      .set('Authorization', `${body.token}`)
      .send();
    expect(response.status).toBe(422);
    expect(response.body.internal_code).toBe('schema_validation_error');
    expect(response.body.message.page.msg).toBe('Page must be an integer greater than zero.');
    done();
  });

  test('Should get page 1 of users', async done => {
    await createMany();
    const body = await loginNewUser(user);
    const response = await request(app)
      .get('/users')
      .query({ page: 1, limit: 2 })
      .set('Authorization', `${body.token}`)
      .send();
    expect(response.status).toBe(200);
    expect(response.body.currentPage).toBe(1);
    done();
  });
});
