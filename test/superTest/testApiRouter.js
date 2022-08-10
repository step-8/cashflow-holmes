const request = require('supertest');
const { createApp } = require('../../src/app');
const { testDeps: { config, session } } = require('../testDependencies');

describe('ApiRouter', () => {
  let app;
  let cookies;

  before(done => {
    app = createApp(config, session);
    request(app)
      .post('/login')
      .send('username=user&password=123')
      .end((err, res) => {
        cookies = res.header['set-cookie'];
        done();
      });
  });

  describe('GET /api/game', () => {
    it('Should give status code of 200 with game state', (done) => {
      request(app)
        .get('/api/game')
        .set('Cookie', cookies.join(';'))
        .expect('content-type', /json/)
        .expect(200, done);
    });
  });
});
