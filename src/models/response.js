class Response {
  constructor(players) {
    this.players = players;
  }
  set responded(username) {
    const player = this.players.find(player => player.username === username);
    player.responded = true;
  }

  areReceived() {
    return this.players.every(player => player.responded);
  }

  isReceived(username) {
    return this.players.find(player => player.username === username).responded;
  }

}

const createResponses = (players) => {
  const playerResponses = players.map(
    player => ({ username: player.username, responded: false })
  );
  return playerResponses;
};

module.exports = { Response, createResponses };
