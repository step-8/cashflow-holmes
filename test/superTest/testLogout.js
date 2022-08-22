const { createApp } = require('../../src/app.js');
const request = require('supertest');
const { assert } = require('chai');
const { testDeps: { config, session } } = require('../testDependencies');

describe('Logout', () => {
  let cookies;

  const app = createApp(config, session);
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

