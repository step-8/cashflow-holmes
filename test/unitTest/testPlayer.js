const { Player } = require('../../src/models/player');
const professions = require('../../data/professions.json');
const { assert } = require('chai');
const { Profile } = require('../../src/models/profile');

describe('Player', () => {
  const professionStr = JSON.stringify(professions[0]);

  it('Should update current and last positions on movement', () => {
    const profession = JSON.parse(professionStr);
    const profile = new Profile(profession);
    const player = new Player('p3', 'guest', 'red', profession, profile);
    player.move(3);
    assert.strictEqual(player.details.currentPosition, 3);
    assert.strictEqual(player.details.lastPosition, 0);
  });

  it('Should move to 24 if position is 0', () => {
    const profession = JSON.parse(professionStr);
    const profile = new Profile(profession);
    const player = new Player('p3', 'guest', 'red', profession, profile);
    player.move(24);
    assert.strictEqual(player.details.currentPosition, 24);
  });

  it('Should return true when cash is above 0', () => {
    const profession = JSON.parse(professionStr);
    const profile = new Profile(profession);
    const player = new Player('p3', 'guest', 'red', profession, profile);
    assert.isOk(player.doodad());
  });

  it('Should return false when cash is less than 0', () => {
    const profession = JSON.parse(professionStr);
    const profile = new Profile(profession);
    const player = new Player('p3', 'guest', 'red', profession, profile);
    assert.isNotOk(player.doodad(30000));
  });

  it('Should add loan in players profile', () => {
    const profession = JSON.parse(professionStr);
    const profile = new Profile(profession);
    const player = new Player('p3', 'guest', 'red', profession, profile);
    assert.isOk(player.takeLoan(100));
  });

  it('Should deduct loan in players profile', () => {
    const profession = JSON.parse(professionStr);
    const profile = new Profile(profession);
    const player = new Player('p3', 'guest', 'red', profession, profile);
    assert.isOk(player.payLoan(100));
  });

  it('Should not deduct cash when player doesn\'t have sufficient cash', () => {
    const profession = JSON.parse(professionStr);
    const profile = new Profile(profession);
    const player = new Player('p3', 'guest', 'red', profession, profile);
    player.takeLoan(1100);
    player.doodad(1100);
    assert.isNotOk(player.payLoan(1500));
  });

  it('should add baby to the player', () => {
    const profession = JSON.parse(professionStr);
    const profile = new Profile(profession);
    const player = new Player('p3', 'guest', 'red', profession, profile);
    assert.isOk(player.baby());
  });

  it('should initialize skipped turns count to 2', () => {
    const profession = JSON.parse(professionStr);
    const profile = new Profile(profession);
    const player = new Player('p3', 'guest', 'red', profession, profile);
    player.initializeSkippedTurns();
    assert.strictEqual(player.skippedTurns, 2);
  });

  it('should decrement skipped turns count', () => {
    const profession = JSON.parse(professionStr);
    const profile = new Profile(profession);
    const player = new Player('p3', 'guest', 'red', profession, profile);
    player.initializeSkippedTurns();
    player.decrementSkippedTurns();
    assert.strictEqual(player.skippedTurns, 1);
  });

  it('should initialize dual dice count to 3', () => {
    const profession = JSON.parse(professionStr);
    const profile = new Profile(profession);
    const player = new Player('p3', 'guest', 'red', profession, profile);
    player.initializeDualDiceCount();
    assert.strictEqual(player.dualDiceCount, 3);
  });

  it('should decrement dual dice count', () => {
    const profession = JSON.parse(professionStr);
    const profile = new Profile(profession);
    const player = new Player('p3', 'guest', 'red', profession, profile);
    player.initializeDualDiceCount();
    player.decrementDualDiceCount();
    assert.strictEqual(player.dualDiceCount, 2);
  });

  it('should bought lottery be false if not enough money', () => {
    const profession = JSON.parse(professionStr);
    const profile = new Profile(profession);
    const player = new Player('p3', 'guest', 'red', profession, profile);
    player.buyLottery(20);
    assert.isNotOk(player.details.canReRoll);
  });

  it('should not add baby when there are 3 babies', () => {
    const profession = JSON.parse(professionStr);
    const profile = new Profile(profession);
    const player = new Player('p3', 'guest', 'red', profession, profile);
    player.baby();
    player.baby();
    player.baby();
    assert.isNotOk(player.baby());
  });
});
