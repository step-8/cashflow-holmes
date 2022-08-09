const { createApp } = require('../../src/app.js');
const supertest = require('supertest');
const assert = require('assert');

describe('Login', () => {
  let cookies;
  const config = {
    PUBLIC: './public',
    REGISTER_PAGE: './views/register.html',
    LOGIN_PAGE: './views/login.html',
    CRED_PATH: './test/test.json',
    SECRET: 'test',
    persistCredentials: () => (req, res) => res.redirect('/')
  };

  const request = supertest(createApp(config));
  before(done => {
    request
      .post('/register')
      .send('username=abcd&password=123')
      .expect(res => {
        cookies = res.headers['set-cookie'];
      })
      .end(done);
  });

  it('should provide login page when requested /login GET', (done) => {
    supertest(createApp(config))
      .get('/login')
      .expect(/html/)
      .expect(200, done);
  });

  it('should login the user /login POST', (done) => {
    request
      .post('/login')
      .send('username=abcd&password=123')
      .expect('location', '/')
      .expect(302, done);
  });
});
