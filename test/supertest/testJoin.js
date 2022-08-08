const request = require('supertest');
const { createApp } = require('../../src/app');

describe('POST /join', () => {
  let app;
  let cookies;

  beforeEach(done => {
    const config = {
      PUBLIC: './public',
      REGISTER_PAGE: './views/register.html',
      CRED_PATH: './test/test.json',
      SECRET: 'test',
      ENV: 'test',
      persistCredentials: () => (req, res) => res.redirect('/')
    };

    app = createApp(config);
    request(app)
      .post('/login')
      .end((err, res) => {
        cookies = res.header['set-cookie'];
        done();
      });
  });

  it('Should send status code of 200 for valid room id', (done) => {
    request(app)
      .post('/join')
      .send('roomId=123')
      .expect(200, done);
  });

  it('Should send status code of 400 for invalid room id', (done) => {
    request(app)
      .post('/join')
      .send('roomId=12')
      .expect(400, done);
  });
});
