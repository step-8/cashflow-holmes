const { assert } = require('chai');
const { generateRatTile, capitalize, toWords } = require('../../src/utils/commonLib.js');

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

describe('capitalize', () => {
  it('Should capitalize first letter of the word', () => {
    const capitalizedWord = capitalize('bin');
    assert.strictEqual(capitalizedWord, 'Bin');
  });

  it('Should not perform any action on numbers', () => {
    const capitalizedWord = capitalize(123);
    assert.strictEqual(capitalizedWord, '123');
  });
});

describe('generateRatTile', () => {
  it('Should generate a tile of game board', () => {
    const expected = '<div class="ratrace-tile flex-row doodad" id="rat-tile-2"><div class="tile-info flex-column"><img src="images/ratrace/doodad.png" alt="doodad"><div class="tile-name">Doodad</div></div></div>';

    const actual = generateRatTile('doodad', 2);
    assert.strictEqual(actual, expected);
  });
});
