const request = require('supertest');
const { createApp } = require('../../src/app');


describe('POST /join', () => {
  let app;
  let cookies;

  const config = {
    PUBLIC: './public',
    REGISTER_PAGE: './views/register.html',
    LOGIN_PAGE: './views/login.html',
    CRED_PATH: './test/test.json',
    SECRET: 'test',
    ENV: 'test',
    persistCredentials: () => (req, res) => res.redirect('/')
  };

  before(done => {
    app = createApp(config);
    request(app)
      .post('/register')
      .send('username=user&password=123')
      .end(done);  
  });
  
  beforeEach(done => {
    app = createApp(config);
    request(app)
      .post('/login')
      .send('username=user&password=123')
      .end((err, res) => {
        cookies = res.header['set-cookie'];
        done();
      });
  });
  describe('POST /join', () => {
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
});
