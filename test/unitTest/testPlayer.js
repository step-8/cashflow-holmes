const { Player } = require('../../src/models/player');
const professions = require('../../data/professions.json');
const { assert } = require('chai');
const { Profile } = require('../../src/models/profile');

describe('Player', () => {
  const profession = JSON.stringify(professions[0]);

  it('Should update current and last positions on movement', () => {
    const profile = new Profile(JSON.parse(profession));
    const player = new Player('p3', 'guest', 'red', profile);
    player.move(3);
    assert.strictEqual(player.details.currentPosition, 3);
    assert.strictEqual(player.details.lastPosition, 0);
  });

  it('Should move to 24 if position is 0', () => {
    const profile = new Profile(JSON.parse(profession));
    const player = new Player('p3', 'guest', 'red', profile);
    player.move(24);
    assert.strictEqual(player.details.currentPosition, 24);
  });

  it('Should return true when cash is above 0', () => {
    const profile = new Profile(JSON.parse(profession));
    const player = new Player('p3', 'guest', 'red', profile);
    assert.isOk(player.doodad());
  });

  it('Should return false when cash is less than 0', () => {
    const profile = new Profile(JSON.parse(profession));
    const player = new Player('p3', 'guest', 'red', profile);
    assert.isNotOk(player.doodad(30000));
  });

  it('Should add loan in players profile', () => {
    const profile = new Profile(JSON.parse(profession));
    const player = new Player('p3', 'guest', 'red', profile);
    assert.isOk(player.takeLoan(100));
  });

  it('Should deduct loan in players profile', () => {
    const profile = new Profile(JSON.parse(profession));
    const player = new Player('p3', 'guest', 'red', profile);
    assert.isOk(player.payLoan(100));
  });

  it('Should not deduct cash when player doesn\'t have sufficient cash', () => {
    const profile = new Profile(JSON.parse(profession));
    const player = new Player('p3', 'guest', 'red', profile);
    player.takeLoan(1100);
    player.doodad(1100);
    assert.isNotOk(player.payLoan(1500));
  });

  it('should add baby to the player', () => {
    const profile = new Profile(JSON.parse(profession));
    const player = new Player('p3', 'guest', 'red', profile);
    assert.isOk(player.baby());
  });

  it('should not add baby when there are 3 babies', () => {
    const profile = new Profile(JSON.parse(profession));
    const player = new Player('p3', 'guest', 'red', profile);
    player.baby();
    player.baby();
    player.baby();
    assert.isNotOk(player.baby());
  });
});
