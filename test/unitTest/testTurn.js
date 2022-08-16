const { Turn } = require('../../src/models/turn.js');
const assert = require('assert');

describe('Turn', () => {
  it('Should skip the turn', () => {
    const turn = new Turn('card1', 'player1');
    turn.skip();
    assert.ok(turn.info.state);
  });

  it('Should update the card', () => {
    const turn = new Turn('card1', 'player1');
    turn.updateCard('c2');
    assert.strictEqual(turn.info.card, 'c2');
  });

  it('Should update the player', () => {
    const turn = new Turn('card1', 'player1');
    turn.updatePlayer('p2');
    assert.strictEqual(turn.info.player, 'p2');
  });
});

