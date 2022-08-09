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

  it('Should give 200 and serve host-lobby', (done) => {
    req
      .get('/host-lobby')
      .set('Cookie', cookie.join(';'))
      .expect(/lobby/)
      .expect(200, done);
  });
});
