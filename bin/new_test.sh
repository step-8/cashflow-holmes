TESTS="const request = require('supertest');
const { createApp } = require('../../src/app');
const { testDeps: { config, session } } = require('../testDependencies');

describe('Test Description', () => {
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
      .set('Cookie', cookies)
      .end(done);
  });

});"


function main() {
  local testDir="$1"
  local testFile="$2"

  if [[ "${testDir}" == "superTest" ]]
  then
    echo "${TESTS}" > test/${testDir}/${testFile}
  fi
  code test/${testDir}/${testFile}
}


main "$1" "$2"