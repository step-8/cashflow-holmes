const random = () => {
  return [0, 2, 0, 2, 0, 2][Math.floor(Math.random() * 5)];
};

const getFamily = (deals, type) => {
  if (deals.includes(type)) {
    type = 'deal';
  }
  return type;
};

class RatRace {
  #tiles;
  #deck;
  #notifications;
  constructor(deck) {
    this.#tiles = {
      'deals': [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23],
      'payday': [6, 14, 22],
      'market': [8, 16, 24],
      'doodad': [2, 10, 18],
      'charity': [4],
      'downsized': [12],
      'baby': [20]
    };
    this.#deck = deck;
    this.#notifications = ['payday'];
  }

  getCardType(tilePosition) {
    for (const tile in this.#tiles) {
      if (this.#tiles[tile].includes(tilePosition)) {
        return tile;
      }
    }
  }

  pickCard(type) {
    if (this.#notifications.includes(type)) {
      return {};
    }

    if (type === 'smallDeal') {
      return this.#deck[type][random()];
    }

    return this.#deck[type][0];
  }

  getNotifications(type) {
    if (this.#notifications.includes(type)) {
      return [this.#deck[type][0]];
    }

    return [];
  }

  getCard(type) {
    const deals = ['smallDeal', 'bigDeal'];
    const validTypes = [
      ...deals,
      'market',
      'doodad',
      'charity',
      'baby',
      'downsized',
      'payday'
    ];

    if (type === 'deals') {
      return {
        heading: 'Choose Big or Small Deal',
        family: 'deal',
        type: 'deal'
      };
    }

    if (validTypes.includes(type)) {
      return { ...this.pickCard(type), family: getFamily(deals, type), cardName: type, notifications: this.getNotifications(type) };
    }
    return;
  }
}

module.exports = { RatRace };
