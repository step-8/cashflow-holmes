const { Log } = require('../../src/models/log.js');
const { assert } = require('chai');

describe('Log', () => {
  it('Should add a log', () => {
    const logMsgs = [{ username: 'a', color: 'c', message: 'b' }];
    const log = new Log();
    log.addLog({ username: 'a', color: 'c' }, 'b');
    assert.deepStrictEqual(log.getAllLogs(), logMsgs);
  });

  it('Should give all logs', () => {
    const logMsgs = [
      { username: 'a', color: 'c', message: 'b' },
      { username: 'd', color: 'e', message: 'f' },
    ];

    const log = new Log();
    log.addLog({ username: 'a', color: 'c' }, 'b');
    log.addLog({ username: 'd', color: 'e' }, 'f');
    assert.deepStrictEqual(log.getAllLogs(), logMsgs);
  });
});
