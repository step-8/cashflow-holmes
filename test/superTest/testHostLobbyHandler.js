const request = require('supertest');
const { createApp } = require('../../src/app');
const { testDeps: { config, session } } = require('../testDependencies');

describe('GET /host-lobby', () => {
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

  it('Should give 200 and serve host-lobby', (done) => {
    req
      .get('/host-lobby')
      .set('Cookie', cookie.join(';'))
      .expect(/lobby/)
      .expect(200, done);
  });
});
