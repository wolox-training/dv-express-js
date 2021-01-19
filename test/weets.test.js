const request = require('supertest');
const api = require('../config/axios');

const app = require('../app');
const { buildUser } = require('./factory/users');
const { createWeet } = require('./factory/weets');
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

describe('Get Weets', () => {
  test('Should fail for unauthenticate user', async done => {
    const response = await request(app)
      .get('/weets')
      .send()
      .expect(401);
    expect(response.text).toContain('Please sign in');
    done();
  });

  test('Should work without weets', async done => {
    const body = await loginNewUser(user.dataValues);
    const response = await request(app)
      .get('/weets')
      .set('Authorization', `${body.token}`)
      .send()
      .expect(200);
    expect(response.text).toContain('no weets to show');
    done();
  });

  test('Should get weets', async done => {
    const body = await loginNewUser(user.dataValues);
    await createWeet();
    const response = await request(app)
      .get('/weets')
      .set('Authorization', `${body.token}`)
      .send()
      .expect(200);
    expect(response.text).toContain('fake weet');
    done();
  });

  test('Should get weets acording to query', async done => {
    const body = await loginNewUser(user.dataValues);
    await createWeet();
    await createWeet();
    const response = await request(app)
      .get('/weets')
      .set('Authorization', `${body.token}`)
      .query({ page: 2, limit: 1 })
      .send()
      .expect(200);
    expect(response.text).toContain('currentPage":"2');
    done();
  });

  test('Should fail for invalid page value', async done => {
    const body = await loginNewUser(user.dataValues);
    await createWeet();
    await createWeet();
    const response = await request(app)
      .get('/weets')
      .set('Authorization', `${body.token}`)
      .query({ page: 3, limit: 1 })
      .send()
      .expect(400);
    expect(response.text).toContain('Page requested exceed the total of pages.');
    done();
  });
});
