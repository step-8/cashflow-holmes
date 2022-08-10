const request = require('supertest');
const { createApp } = require('../../src/app.js');
const { testDeps: { config, session } } = require('../testDependencies');

describe('Join', () => {
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

  describe('POST /join', () => {
    it('Should send status code of 400 for invalid room id', (done) => {
      request(app)
        .post('/join')
        .set('Cookie', cookies.join(';'))
        .send('roomId=12')
        .expect(400, done);
    });
  });

  describe('GET /guest-lobby', () => {
    it('Should give 200 with guest lobby page', (done) => {
      request(app)
        .get('/guest-lobby')
        .set('Cookie', cookies.join(';'))
        .expect(/Room Id :/)
        .expect(200, done);
    });
  });

  describe('GET /leave-lobby', () => {
    it('Should give 302 when player leaves the lobby', (done) => {
      request(app)
        .get('/leave-lobby')
        .set('Cookie', cookies.join(';'))
        .expect('location', '/')
        .expect(302, done);
    });
  });
});
