class Response {
  constructor(players) {
    this.players = players;
    this.ResponseType = 'individual';
  }

  forGroup() {
    this.ResponseType = 'group';
  }

  set responded(username) {
    const player = this.players.find(player => player.username === username);
    player.responded = true;
  }

  #areReceived() {
    return this.players.every(player => player.responded);
  }

  isReceived(username) {
    if (this.ResponseType === 'group') {
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
