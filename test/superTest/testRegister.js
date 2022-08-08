const { createApp } = require('../../src/app.js');
const supertest = require('supertest');
const assert = require('assert');

describe('Register', () => {
  const config = {
    PUBLIC: './public',
    REGISTER_PAGE: './views/register.html',
    CRED_PATH: './test/test.json',
    SECRET: 'test',
    persistCredentials: () => (req, res) => res.redirect('/')
  };

  it('When requested /register GET', (done) => {
    supertest(createApp(config))
      .get('/register')
      .expect(/html/)
      .expect(200, done);
  });

  it('should register the new user /register POST', (done) => {
    supertest(createApp(config))
      .post('/register')
      .send('username=abcd&password=123')
      .expect('location', '/')
      .expect(302, done);
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
      
    supertest(createApp(config))
      .post('/register')
      .send('username=abcd&password=123')
      .expect('location', '/')
      .expect(302, done);
  });
});
