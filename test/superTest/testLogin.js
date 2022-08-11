const { createApp } = require('../../src/app.js');
const supertest = require('supertest');
const { testDeps: { config, session } } = require('../testDependencies');

describe('Login', () => {
  let cookies;

  const request = supertest(createApp(config, session));
  before(done => {
    request
      .post('/login')
      .send('username=user&password=123')
      .expect(res => {
        cookies = res.headers['set-cookie'];
      })
      .end(done);
  });

  it('should provide login page when requested /login GET', (done) => {
    supertest(createApp(config, session))
      .get('/login')
      .expect(/html/)
      .expect(200, done);
  });

  it('should login the user /login POST', (done) => {
    request
      .post('/login')
      .send('username=user&password=123')
      .expect('location', '/')
      .expect(302, done);
  });

  before((done) => {
    request
      .post('/login')
      .send('username=user&password=123456')
      .expect(res => {
        cookies = res.headers['set-cookie'];
      })
      .end(done);
  });
  
  it('should show error when tried login with invalid creds/login POST',
    (done) => {
      request
        .get('/login')
        .set('Cookie', cookies)
        .expect(/Invalid credentials/)
        .expect(200, done);
    });
});
