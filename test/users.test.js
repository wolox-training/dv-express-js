const request = require('supertest');

const app = require('../app');
const loginNewUser = require('./utils/users');
const { createUser, createMany, attributes } = require('./factory/users');

let user = '';

beforeEach(async () => {
  user = await attributes();
});

describe('Post Sign Up', () => {
  test('Should sign up a new user', async done => {
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
    expect(response.body.users.length).toBe(1);
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

  test('Should get 2 users in page 1', async done => {
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

describe('Post User Admin', () => {
  test('Should fail for unauthenticated user', async done => {
    const response = await request(app)
      .post('/admin/users')
      .send(user);
    expect(response.status).toBe(401);
    expect(response.body.internal_code).toBe('unauthenticated_error');
    expect(response.body.message).toBe('Please sign in to access this module.');
    done();
  });

  test('Should fail for unauthorized user', async done => {
    const body = await loginNewUser(user);
    const response = await request(app)
      .post('/admin/users')
      .set('Authorization', `${body.token}`)
      .send(user);
    expect(response.status).toBe(403);
    expect(response.body.internal_code).toBe('forbiden_module_error');
    expect(response.body.message).toBe('You have no access to this module.');
    done();
  });

  test('Should post admin for authorized user', async done => {
    const body = await loginNewUser({ ...user, role: 'admin' });
    const differentUser = await attributes();
    const response = await request(app)
      .post('/admin/users')
      .set('Authorization', `${body.token}`)
      .send(differentUser);
    expect(response.status).toBe(201);
    expect(response.body.email).toBe(differentUser.email);
    expect(response.body.role).toBe('admin');
    done();
  });
});

describe('Post invalidate all sessions', () => {
  test('Should fail for unauthenticated user', async done => {
    const response = await request(app)
      .post('/users/sessions/invalidate_all')
      .send();
    expect(response.status).toBe(401);
    expect(response.body.internal_code).toBe('unauthenticated_error');
    expect(response.body.message).toBe('Please sign in to access this module.');
    done();
  });

  test('Should invalidate all user sessions', async done => {
    const body = await loginNewUser(user);
    const response = await request(app)
      .post('/users/sessions/invalidate_all')
      .set('Authorization', `${body.token}`)
      .send();
    expect(response.status).toBe(204);
    done();
  });

  test('Should fail fot user with invalidate session', async done => {
    const body = await loginNewUser(user);
    await request(app)
      .post('/users/sessions/invalidate_all')
      .set('Authorization', `${body.token}`)
      .send();
    const response = await request(app)
      .post('/users/sessions/invalidate_all')
      .set('Authorization', `${body.token}`)
      .send();
    expect(response.status).toBe(401);
    expect(response.body.internal_code).toBe('invalid_access_token_error');
    expect(response.body.message).toBe('Invalid access token. Please sign in.');
    done();
  });
});
