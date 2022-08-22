const random = () => {
  return [0, 2, 0, 2, 0, 2][Math.floor(Math.random() * 5)];
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
    this.#notifications = ['payday', 'downsized', 'baby'];
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

  getNotifications(type, currentPlayer) {
    const deals = ['smallDeal', 'bigDeal'];
    if (deals.includes(type)) {
      return [];
    }

    const { lastPosition, currentPosition } = currentPlayer;
    const notificationsTiles = getAllNotificationTiles(
      this.#tiles, this.#notifications, lastPosition, currentPosition
    );

    const crossers = notificationsTiles.filter(crosser => crosser === 'payday');
    const nonCrossers = ['downsized', 'baby'];
    const currentCardType = this.getCardType(currentPosition);
    if (nonCrossers.includes(currentCardType)) {
      crossers.push(currentCardType);
    }

    return crossers.map(tile => {
      return { ...this.#deck[tile][0], family: tile };
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
        ...this.pickCard(type), family: getFamily(deals, type), cardName: type
      };
    }
    return;
  }
}

module.exports = { RatRace };
