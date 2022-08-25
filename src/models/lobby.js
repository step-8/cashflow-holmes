const { Game } = require('./game');
const { Player } = require('./player');

const getColor = (players, colors) => {
  const usedColors = players.map(player => player.details.color);
  return colors.find(color => !usedColors.includes(color));
};

const getProfession = (players, professions) => {
  const usedProfessions = players.map(player => player.profile().profession);
  return professions.find(
    ({ profession }) => !usedProfessions.includes(profession));
};

class Lobby {
  #colors;
  #professions;
  #gameID;
  #dice;
  #players;
  #maxPlayers;
  #status;

  constructor(gameID, colors, professions, dice) {
    this.#colors = colors;
    this.#professions = professions;
    this.#gameID = gameID;
    this.#dice = dice;
    this.#status = 'waiting';
    this.#maxPlayers = 6;
    this.#players = [];
  }

  isValid(gameID) {
    return this.#gameID === gameID;
  }

  isFull() {
    return this.#maxPlayers === this.#players.length;
  }

  #getPlayerIndex(username) {
    return this.#players.findIndex(player => player.details.username === username);
  }

  #isUserAlreadyJoined(username) {
    const playerStatus = this.#getPlayerIndex(username);
    return playerStatus > -1;
  }

  #addPlayer(username, role) {
    if (this.#isUserAlreadyJoined(username)) {
      return;
    }

    const color = getColor(this.#players, this.#colors);
    const profession = getProfession(this.#players, this.#professions);
    const player = new Player(username, role, color, profession);
    player.setDefaults();
    this.#players.push(player);
  }

  removePlayer(username) {
    const playerIndex = this.#getPlayerIndex(username);
    if (playerIndex <= -1) {
      return;
    }
    this.#players.splice(playerIndex, 1);
  }

  assignHost(username) {
    this.#addPlayer(username, 'host');
  }

  addGuest(username) {
    this.#addPlayer(username, 'guest');
  }

  start() {
    this.#status = 'started';
    return new Game(this.#gameID, this.#players, this.#dice);
  }

  cancel() {
    this.#status = 'cancelled';
  }

  get allPlayerDetails() {
    return this.#players.map(player => player.details);
  }

  get state() {
    return {
      status: this.#status,
      gameID: this.#gameID,
      players: this.allPlayerDetails,
    };
  }
}

module.exports = { Lobby };
