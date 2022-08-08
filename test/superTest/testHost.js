const request = require('supertest');
const { createApp } = require('../../src/app');

const config = {};

describe('GET /host', () => {
  let cookie = '';
  const req = request(createApp(config));
  beforeEach((done) => {
    req
      .post('/login')
      .end((err, res) => {
        if (err) {
          return;
        }
        cookie = res.headers['set-cookie'];
        done();
      });
  });

  it('Should give 401 if not logged in', (done) => {
    request(createApp(config))
      .get('/host')
      .expect(401, done);
  });

  it('Should redirect to /host-lobby if logged in', (done) => {
    req
      .get('/host')
      .set('Cookie', cookie)
      .expect('location', '/host-lobby')
      .expect(302, done);
  });
});
