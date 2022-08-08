const request = require('supertest');
const { createApp } = require('../../src/app');

const config = {
  PUBLIC: './public',
  REGISTER_PAGE: './views/register.html',
  LOGIN_PAGE: './views/login.html',
  CRED_PATH: './test/test.json',
  SECRET: 'test',
  persistCredentials: () => (req, res) => res.redirect('/')
};


const req = request(createApp(config));

describe('GET /', () => {
  let cookie;

  before(done => {
    req
      .post('/register')
      .send('username=user&password=123')
      .end(done);  
  });
  
  beforeEach((done) => {
    req
      .post('/login')
      .send('username=user&password=123')
      .end((err, res) => {
        if (err) {
          return;
        }
        cookie = res.headers['set-cookie'];
        done();
      });
  });

  it('Should redirect to /login if not login', (done) => {
    req
      .get('/')
      .expect('location', '/login')
      .end(done);
  });

  it('Should serve main menu if logged in', (done) => {
    req
      .get('/')
      .set('Cookie', cookie.join(';'))
      .expect(200, done);
  });

});
