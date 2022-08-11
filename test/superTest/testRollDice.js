const request = require('supertest');
const { createApp } = require('../../src/app');
const { testDeps: { config, session } } = require('../testDependencies');

describe('Roll Dice', () => {
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

  describe('GET /roll-dice', () => {
    it('Should roll a die and give status 200 back', (done) => {
      request(app)
        .get('/roll-dice')
        .set('Cookie', cookies.join(';'))
        .expect(200, done);
    });
  });

});
