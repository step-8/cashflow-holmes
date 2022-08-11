const { createApp } = require('../../src/app.js');
const supertest = require('supertest');
const assert = require('assert');
const { testDeps: { config, session } } = require('../testDependencies');

describe('Register', () => {
  let cookies;

  it('When requested /register GET', (done) => {
    supertest(createApp(config, session))
      .get('/register')
      .expect(/html/)
      .expect(200, done);
  });

  it('should register the new user /register POST', (done) => {
    supertest(createApp(config, session))
      .post('/register')
      .send('username=abcd&password=123')
      .expect('location', '/')
      .expect(302, done);
  });

  before((done) => {
    supertest(createApp(config, session))
      .post('/register')
      .send('username=user&password=123')
      .expect(res => {
        cookies = res.headers['set-cookie'];
      })
      .end(done);
  });

  it('should show error on register when username unavailable /register GET', (done) => {
    supertest(createApp(config, session))
      .get('/register')
      .set('Cookie', cookies)
      .expect(/Username not available/)
      .expect(200, done);
  });

  it('should persist the userdata in the given file', (done) => {
    const config = {
      PUBLIC: './public',
      REGISTER_PAGE: './views/register.html',
      CRED_PATH: './test/test.json',
      SECRET: 'test',

      persistCredentials: (config) => (req, res) => {
        assert.equal(config.CRED_PATH, './test/test.json');
        res.redirect('/');
      }
    };

    supertest(createApp(config, session))
      .post('/register')
      .send('username=abcd&password=123')
      .expect('location', '/')
      .expect(302, done);
  });
});
