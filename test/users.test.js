const request = require('supertest');

const app = require('../app');
const db = require('../app/models');
// const { factoryByModel } = require('./factory/factory_by_models');
const { createUser, buildUser } = require('./factory/users');

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
  await db.User.destroy({ truncate: { cascade: true } });
  user = await buildUser();
});

describe('Post Sign Up', () => {
  test('Should sign up a new user', async done => {
    // const user = await factoryByModel('User');
    const response = await request(app)
      .post('/users')
      .send(user.dataValues);
    expect(response.status).toBe(201);
    expect(response.text).toContain(user.dataValues.firstName);
    done();
  });

  test('Should fail for invalid password', async done => {
    const invalidPassword = { ...user.dataValues, password: 'contra12*' };
    const response = await request(app)
      .post('/users')
      .send(invalidPassword);
    expect(response.status).toBe(422);
    expect(response.text).toContain('Password must');
    done();
  });

  test('Should fail for email in use', async done => {
    const newUser = await createUser();
    const response = await request(app)
      .post('/users')
      .send(newUser.dataValues);
    expect(response.status).toBe(409);
    expect(response.text).toContain('Email is already');
    done();
  });

  test('Should fail for empty parameters', async done => {
    const response = await request(app)
      .post('/users')
      .send();
    expect(response.status).toBe(422);
    expect(response.text).toContain('cannot be empty');
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
        password: user.dataValues.password
      });
    expect(response.text).toContain('token');
    expect(response.status).toBe(200);

    done();
  });
});

describe('Get Users', () => {
  test('Should fail for unauthenticated user', async done => {
    const response = await request(app)
      .get('/users')
      .send();
    expect(response.status).toBe(401);
    expect(response.text).toContain('Please sign in');
    done();
  });

  test('Should work for authenticated user', async done => {
    const body = await loginNewUser(user.dataValues);
    const response = await request(app)
      .get('/users')
      .set('Authorization', `${body.token}`)
      .send();
    expect(response.status).toBe(200);
    done();
  });

  test('Should fail for wrong query params', async done => {
    const body = await loginNewUser(user.dataValues);
    const response = await request(app)
      .get('/users')
      .query({ page: 'primera' })
      .set('Authorization', `${body.token}`)
      .send();
    expect(response.status).toBe(422);
    expect(response.text).toContain('page must be integer.');
    done();
  });
});

describe('Post User Admin', () => {
  test('Should fail for unauthenticate user', async done => {
    const response = await request(app)
      .post('/admin/users')
      .send(user.dataValues)
      .expect(401);
    expect(response.text).toContain('Please sign in');
    done();
  });

  test('Should fail for unauthorized user', async done => {
    const body = await loginNewUser(user.dataValues);
    const response = await request(app)
      .post('/admin/users')
      .set('Authorization', `${body.token}`)
      .send(user.dataValues);
    expect(response.status).toBe(403);
    expect(response.text).toContain('forbiden_module_error');
    done();
  });

  test('Should post admin for authorized user', async done => {
    const body = await loginNewUser({ ...user.dataValues, role: 'admin' });
    const differentUser = await buildUser();
    const response = await request(app)
      .post('/admin/users')
      .set('Authorization', `${body.token}`)
      .send({ ...differentUser.dataValues, email: 'daniel.vega@wolox.co' });
    expect(response.status).toBe(201);
    expect(response.text).toContain('daniel.vega@wolox.co');
    done();
  });
});
