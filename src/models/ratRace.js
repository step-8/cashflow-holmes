const random = (number) => {
  return Math.floor(Math.random() * number);
};

const getSpecificCard = (type, cards) => {
  return cards.find(card => card.type === type);
};

const getFamily = (deals, type) => {
  if (deals.includes(type)) {
    type = 'deal';
  }
  return type;
};

const isInRange = (number, pos1, pos2) => {
  return (pos1 < number) && (pos2 >= number);
};

const getTileIfInRange = (tile, tilePositions, pos1, pos2) => {
  const tileOccurrences = [];

  tilePositions.forEach(tilePosition => {
    if (isInRange(tilePosition, pos1, pos2)) {
      tileOccurrences.push(tile);
    }
  });

  return tileOccurrences;
};

const getAllNotificationTiles = (tiles, notifications, pos1, pos2) => {
  const notificationTiles = [];

  Object.keys(tiles).forEach(tile => {
    if (notifications.includes(tile)) {
      notificationTiles.push(
        ...getTileIfInRange(tile, tiles[tile], pos1, pos2)
      );
    }
  });

  return notificationTiles;
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
    this.#notifications = ['payday', 'baby'];
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
      return getSpecificCard('realEstate', this.#deck[type]);
    }

    return this.#deck[type][random(Object.keys(this.#deck[type]).length - 1)];
  }

  getNotifications(type, currentPlayer, username) {
    const deals = ['smallDeal', 'bigDeal'];
    if (deals.includes(type)) {
      return [];
    }

    const { lastPosition, currentPosition } = currentPlayer;
    const notificationsTiles = getAllNotificationTiles(
      this.#tiles, this.#notifications, lastPosition, currentPosition
    );

    const crossers = notificationsTiles.filter(crosser => crosser === 'payday');
    const nonCrossers = ['baby'];
    const currentCardType = this.getCardType(currentPosition);
    if (nonCrossers.includes(currentCardType)) {
      crossers.push(currentCardType);
    }

    return crossers.map(tile => {
      return { ...this.#deck[tile][0], family: tile, username };
    });
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
        id: 'deal',
        heading: 'Choose Big or Small Deal',
        family: 'deal',
        type: 'deal'
      };
    }

    if (validTypes.includes(type)) {
      return {
        ...this.pickCard(type), family: getFamily(deals, type), name: type
      };
    }
    return;
  }
}

module.exports = { RatRace };
