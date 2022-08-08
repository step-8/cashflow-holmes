const request = require('supertest');
const { createApp } = require('../../src/app');

const config = {};
const req = request(createApp(config));

describe('GET /', () => {
  let cookie = '';
  beforeEach(() => {
    req
      .post('/login')
      .end((err, res) => {
        if (err) {
          return;
        }
        cookie = res.headers['set-cookie'];
      });
  });

  it('Should redirect to /login if not login', (done) => {
    req
      .get('/')
      .expect('location', '/login')
      .expect(302, done);
  });

  it('Should redirect to /host-lobby if logged in', (done) => {
    req
      .get('/')
      .set('Cookie', cookie)
      .expect('location', '/host-lobby')
      .expect(302, done);
  });
});
