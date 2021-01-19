const request = require('supertest');
const api = require('../config/axios');

const app = require('../app');
const { buildUser } = require('./factory/users');
const loginNewUser = require('./loginNewUser');

jest.mock('../config/axios');

let user = '';

beforeEach(async () => {
  user = await buildUser();
  jest.resetAllMocks();
});

describe('Post Weet', () => {
  test('Should fail for unauthenticate user', async done => {
    const response = await request(app)
      .post('/weets')
      .send()
      .expect(401);
    expect(response.text).toContain('Please sign in');
    done();
  });

  test('Should create a weet', async done => {
    const body = await loginNewUser(user.dataValues);
    await api.get.mockResolvedValue({ data: 'this weet is correct' });
    const response = await request(app)
      .post('/weets')
      .set('Authorization', `${body.token}`)
      .send()
      .expect(201);
    expect(response.text).toContain('this weet is correct');
    done();
  });

  test('Should fail for a weet with more tha 140 characters', async done => {
    const body = await loginNewUser(user.dataValues);
    await api.get.mockResolvedValue({
      data:
        'this weet is tooooooooooooooooooooooooooooooooooooo looooooooooooooooooooooooooooooooonnnnnnnngggggggggg !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'
    });
    const response = await request(app)
      .post('/weets')
      .set('Authorization', `${body.token}`)
      .send();
    expect(response.text).toContain('140 character');
    done();
  });
});
