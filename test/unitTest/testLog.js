const { Log } = require('../../src/models/log.js');
const assert = require('assert');

describe('Log', () => {
  it('Should add a log', () => {
    const logMsgs = [{ username: 'a', message: 'b' }];
    const log = new Log();
    log.addLog('a', 'b');
    assert.deepStrictEqual(log.getAllLogs(), logMsgs);
  });

  it('Should give all logs', () => {
    const logMsgs = [
      { username: 'a', message: 'b' },
      { username: 'c', message: 'd' }
    ];

    const log = new Log();
    log.addLog('a', 'b');
    log.addLog('c', 'd');
    assert.deepStrictEqual(log.getAllLogs(), logMsgs);
  });
});
