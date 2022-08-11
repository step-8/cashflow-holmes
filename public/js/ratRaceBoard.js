(function () {
  const drawPlayers = (game) => {
    const { players } = game;
    fetch('/api/player-info').then(res => res.json()).then(currentPlayer => {

      const playersEle = getElement('#players');

      players.forEach(player => {
        const { username, color } = player;
        let name = username;

        if (currentPlayer.username === username) {
          name = username + '(you)';
        }
        const playerTemplate = ['div', { className: 'row' },
          ['div', { className: `${color} icon` }],
          ['div', { className: 'name' }, name]
        ];
        const playerEle = html(playerTemplate);
        playersEle.append(playerEle);
      });
    });
    return game;
  };

  const highlightCurrentPlayer = (game) => {
    const { username } = game.currentPlayer;
    const currentPlayerEle = document.querySelector(`#${username}`);
    currentPlayerEle.style.backgroundColor = 'lightgrey';
    currentPlayerEle.style.fontWeight = '900';
    return game;
  };

  const main = () => {
    fetch('/api/game').then(res => res.json())
      .then(drawPlayers)
      .then(highlightCurrentPlayer);
  };

  window.onload = main;
})();
