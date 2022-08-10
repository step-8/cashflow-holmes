const request = require('supertest');
const { createApp } = require('../../src/app');
const { testDeps: { config, session } } = require('../testDependencies');

describe('Cancel Game', () => {
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

  describe('GET /cancel-game', () => {
    it('Should give status code of 400 if id doesn\'t match', (done) => {
      request(app)
        .get('/cancel-game')
        .set('Cookie', cookies.join(';'))
        .expect(400, done);
    });
  });
});
