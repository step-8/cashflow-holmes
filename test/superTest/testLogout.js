const { createApp } = require('../../src/app.js');
const request = require('supertest');
const assert = require('assert');

describe('Logout', () => {
  let cookies;
  const config = {
    PUBLIC: './public',
    REGISTER_PAGE: './views/register.html',
    CRED_PATH: './test/test.json',
    SECRET: 'test',
    persistCredentials: (config) => (req, res) => {
      res.redirect('/');
    }
  };
  
  const app = createApp(config);
  before(done => {
    request(app)
      .post('/login')
      .send('username=user&password=123')
      .expect(res => {
        cookies = res.headers['set-cookie'];
      })
      .end(done);
  });

  it('Should remove the user session and redirect to /', (done) => {
    request(app)
      .get('/logout')
      .set('Cookie', cookies.join(';'))
      .expect('location', '/')
      .expect(302)
      .expect(res => {
        assert.notDeepEqual(res.headers['set-cookie'], cookies);
      })
      .end(done);
  });
});

