const assert = require('assert');
const { toWords } = require('../../src/utils/camelCaseToWords.js');

describe('camelCaseToWords', () => {
  it('Should change the camelCase letter to words with spaces', () => {
    assert.strictEqual(toWords('erenYeager'), 'eren yeager');
  });

  it('Should return back the sting if not camel case', () => {
    assert.strictEqual(toWords('abc'), 'abc');
  });

  it('Should return back number if number is given as string', () => {
    assert.strictEqual(toWords('123'), '123');
  });

  it('Should return back empty string', () => {
    assert.strictEqual(toWords(''), '');
  });
});
