const request = require('supertest');
const { createApp } = require('../../src/app');
const { testDeps: { config, session } } = require('../testDependencies');

describe('GET /get-user-info', () => {
  let cookie = '';
  const req = request(createApp(config, session));
  before((done) => {
    req
      .post('/login')
      .send('username=user&password=123')
      .end((err, res) => {
        if (err) {
          return;
        }
        cookie = res.headers['set-cookie'];
        done();
      });
  });

  it('Should give current user info as json', (done) => {
    req
      .get('/get-user-info')
      .set('Cookie', cookie)
      .expect(/"username":"user"/)
      .expect(200, done);
  });
});