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

  before((done) => {
    request(app)
      .get('/host-lobby')
      .set('Cookie', cookies)
      .end(done);
  });

  describe('GET /cancel-game', () => {
    it('Should redirect to main menu after cancel ', (done) => {
      request(app)
        .get('/cancel-game')
        .set('Cookie', cookies.join(';'))
        .expect('location', '/')
        .expect(302, done);
    });
  });

  describe('GET /remove-game', () => {
    it('Should remove game id from session', (done) => {
      request(app)
        .get('/remove-game')
        .set('Cookie', cookies.join(';'))
        .expect(200, done);
    });
  });
});
