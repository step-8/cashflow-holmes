const request = require('supertest');
const { createApp } = require('../../src/app');

describe('ApiRouter', () => {
  let app;
  let cookies;

  const config = {
    PUBLIC: './public',
    REGISTER_PAGE: './views/register.html',
    LOGIN_PAGE: './views/login.html',
    CRED_PATH: './test/test.json',
    SECRET: 'test',
    ENV: 'test',
    persistCredentials: () => (req, res) => res.redirect('/')
  };

  before(done => {
    app = createApp(config);
    request(app)
      .post('/register')
      .send('username=user&password=123')
      .end(done);
  });

  beforeEach(done => {
    app = createApp(config);
    request(app)
      .post('/login')
      .send('username=user&password=123')
      .end((err, res) => {
        cookies = res.header['set-cookie'];
        done();
      });
  });

  describe('GET /game', () => {
    it('Should give status code of 200 with game state', (done) => {
      request(app)
        .get('/api/game')
        .expect('content-type', /json/)
        .expect(200, done);
    });
  });
});
