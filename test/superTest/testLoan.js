const request = require('supertest');
const { createApp } = require('../../src/app');
const { testDeps: { config, session } } = require('../testDependencies');

describe('Change Turn', () => {
  let app;
  let cookies;

  before(done => {
    app = createApp(config, session);
    request(app)
      .post('/login')
      .send('username=user&password=123')
      .end((err, res) => {
        cookies = res.header['set-cookie'];
        done();
      });
  });

  before((done) => {
    request(app)
      .get('/host-lobby')
      .set('Cookie', cookies.join(';'))
      .end(done);
  });

  describe('loan', () => {
    it('/loan/take', (done) => {
      request(app)
        .post('/loan/take')
        .set('Cookie', cookies.join(';'))
        .send({ amount: 10 })
        .expect(200, done);
    });

    it('/loan/pay', (done) => {
      request(app)
        .post('/loan/pay')
        .set('Cookie', cookies.join(';'))
        .send({ amount: 10 })
        .expect(200, done);
    });
  });
});
