const request = require('supertest');
const { createApp } = require('../../src/app');

const config = {
  PUBLIC: './public',
  REGISTER_PAGE: './views/register.html',
  CRED_PATH: './test/test.json',
  SECRET: 'test',
  persistCredentials: () => (req, res) => res.redirect('/')
};

describe('GET /host', () => {
  let cookie = '';
  const req = request(createApp(config));
  before((done) => {
    req
      .post('/register')
      .send('username=user&password=123')
      .end((err, res) => {
        if (err) {
          return;
        }
        cookie = res.headers['set-cookie'];
        done();
      });
  });

  it('Should give 401 if not logged in', (done) => {
    request(createApp(config))
      .get('/host')
      .expect(401, done);
  });

  it('Should redirect to /host-lobby if logged in', (done) => {
    req
      .get('/host')
      .set('Cookie', cookie)
      .expect('location', '/host-lobby')
      .expect(302, done);
  });
});
