const { createApp } = require('../../src/app.js');
const supertest = require('supertest');

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
});
