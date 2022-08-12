class Ratrace {
  #tiles;
  constructor() {
    this.#tiles = {
      'deals': [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23],
      'payday': [6, 14],
      'market': [8, 16, 24],
      'doodad': [2, 10, 18],
      'charity': [4],
      'downsized': [12],
      'baby': [20]
    };
  }

  getCardType(tilePosition) {
    for (const tile in this.#tiles) {
      if (this.#tiles[tile].includes(tilePosition)) {
        return tile;
      }
    }
  }
}

module.exports = { Ratrace };
