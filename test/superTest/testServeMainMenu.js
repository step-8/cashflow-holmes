const request = require('supertest');
const { createApp } = require('../../src/app');

const config = {
  PUBLIC: './public',
  REGISTER_PAGE: './views/register.html',
  CRED_PATH: './test/test.json',
  SECRET: 'test',
  persistCredentials: () => (req, res) => res.redirect('/')
};
const req = request(createApp(config));

describe('GET /', () => {
  let cookie = '';
  beforeEach((done) => {
    req
      .post('/login')
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
      .expect(302, done);
  });

  it('Should say ok if logged in', (done) => {
    req
      .get('/')
      .set('Cookie', cookie)
      .expect(200, done);
  });

});
