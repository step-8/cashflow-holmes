(function () {
  const drawPlayers = (game) => {
    const { players } = game;
    const playersEle = getElement('#players');
    players.forEach(player => {
      const { username, color } = player;
      const playerTemplate = ['div', { className: 'row', id: username},
        ['div', { className: `${color} icon` }],
        ['div', { className: 'name' }, username]
      ];
      const playerEle = html(playerTemplate);
      playersEle.append(playerEle);
    });
    return game;
  };

  const highlightCurrerntPlayer = (game) => {
    const { username } = game.currentPlayer;
    const currentPlayerEle = document.querySelector(`#${username}`);
    currentPlayerEle.style.backgroundColor = 'lightgrey';
    currentPlayerEle.style.fontWeight = '900';
    return game;
  };

  const main = () => {
    fetch('/api/game').then(res => res.json())
      .then(drawPlayers)
      .then(highlightCurrerntPlayer);
  };

  window.onload = main;
})();
