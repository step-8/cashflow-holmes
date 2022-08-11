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
    it('Should send status code of 400 for invalid game id', (done) => {
      request(app)
        .post('/join')
        .set('Cookie', cookies.join(';'))
        .send('gameID=12')
        .expect(400, done);
    });

    it('Should send status code of 401 when host tries to join as a guest', (done) => {
      request(app)
        .post('/join')
        .set('Cookie', cookies.join(';'))
        .send('gameID=1')
        .expect(401, done);
    });
    
    it('Should send status code of 200 when player join game successfully', (done) => {
      request(app)
        .post('/register')
        .send('username=a&password=123')
        .end((err, res) => {
          cookies = res.header['set-cookie'];
          request(app)
            .post('/join')
            .set('Cookie', cookies.join(';'))
            .send('gameID=1')
            .expect(200, done);
        });
    });
  });

  describe('GET /guest-lobby', () => {
    it('Should give 200 with guest lobby page', (done) => {
      request(app)
        .get('/guest-lobby')
        .set('Cookie', cookies.join(';'))
        .expect(/Game Id :/)
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
