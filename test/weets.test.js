const request = require('supertest');
const api = require('../config/axios');

const app = require('../app');
const { attributes } = require('./factory/users');
const loginNewUser = require('./loginNewUser');

jest.mock('../config/axios');

let user = '';

beforeEach(async () => {
  user = await attributes();
  jest.resetAllMocks();
});

describe('Post Weet', () => {
  test('Should fail for unauthenticate user', async done => {
    const response = await request(app)
      .post('/weets')
      .send();
    expect(response.status).toBe(401);
    expect(response.body.internal_code).toBe('unauthenticated_error');
    expect(response.body.message).toBe('Please sign in to access this module.');
    done();
  });

  test('Should create a weet', async done => {
    const body = await loginNewUser(user);
    await api.get.mockResolvedValue({ data: 'this weet is correct' });
    const response = await request(app)
      .post('/weets')
      .set('Authorization', `${body.token}`)
      .send();
    expect(response.status).toBe(201);
    expect(response.body.content).toBe('this weet is correct');
    done();
  });

  test('Should fail for a weet with more tha 140 characters', async done => {
    const body = await loginNewUser(user);
    await api.get.mockResolvedValue({
      data:
        'this weet is tooooooooooooooooooooooooooooooooooooo looooooooooooooooooooooooooooooooonnnnnnnngggggggggg !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'
    });
    const response = await request(app)
      .post('/weets')
      .set('Authorization', `${body.token}`)
      .send();
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('The content of the weet exceeds 140 characters. Try again.');
    done();
  });
});
