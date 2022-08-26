const { Response } = require('../../src/models/response.js');
const { assert } = require('chai');

describe('Response', () => {
  describe('isReceived', () => {
    it('Should give false when player\'s response not received', () => {
      const players = [{ username: 'user', responded: false }];
      const response = new Response(players);

      assert.isNotOk(response.isReceived('user'));
    });

    it('Should give true when player\'s response is received', () => {
      const players = [{ username: 'user', responded: false }];
      const response = new Response(players);

      response.responded = 'user';
      assert.isOk(response.isReceived('user'));
    });

    it('Should give false when all responses are not received', () => {
      const players = [
        { username: 'user', responded: false },
        { username: 'abc', responded: false }
      ];
      const response = new Response(players);
      response.forGroup();

      response.responded = 'user';
      assert.isNotOk(response.isReceived());
    });

    it('Should give true when all responses are received', () => {
      const players = [
        { username: 'user', responded: false },
        { username: 'abc', responded: false }
      ];
      const response = new Response(players);
      response.forGroup();

      response.responded = 'user';
      response.responded = 'abc';
      assert.isOk(response.isReceived());
    });

    it('Should give true when all responses are received', () => {
      const players = [
        { username: 'user', responded: false },
        { username: 'abc', responded: false }
      ];
      const response = new Response(players);
      response.forGroup();

      response.responded = 'user';
      response.responded = 'abc';
      assert.isOk(response.isReceived());
    });
  });

  describe('getCollection', () => {
    it('Should give the collected response', () => {
      const players = [
        { username: 'user', responded: false },
        { username: 'abc', responded: false }
      ];
      const response = new Response(players);
      response.forGroup();

      response.responded = 'user';
      response.responded = 'abc';

      const expectedCollection = [
        { username: 'user', responded: true },
        { username: 'abc', responded: true }
      ];
      assert.deepStrictEqual(response.collection, expectedCollection);
    });
  });
});
