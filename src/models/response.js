class Response {
  constructor(players) {
    this.players = players;
    this.isGroup = false;
  }

  forGroup() {
    this.isGroup = true;
  }

  set responded(username) {
    const player = this.players.find(player => player.username === username);
    player.responded = true;
  }

  #areReceived() {
    return this.players.every(player => player.responded);
  }

  isReceived(username) {
    if (this.isGroup) {
      return this.#areReceived();
    }
    return this.players.find(player => player.username === username).responded;
  }

  get collection() {
    return this.players.map(player => ({ ...player }));
  }
}

const createResponses = (players) => {
  const playerResponses = players.map(
    player => ({ username: player.username, responded: false })
  );
  return playerResponses;
};

module.exports = { Response, createResponses };
