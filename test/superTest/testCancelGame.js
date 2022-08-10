const request = require('supertest');
const { createApp } = require('../../src/app');

describe('Cancel Game', () => {
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
