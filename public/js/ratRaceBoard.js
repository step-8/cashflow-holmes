(function () {
  const drawPlayers = (game) => {
    const { players } = game;
    const playersEle = getElement('#players');
    players.forEach(player => {
      const { username, color } = player;
      const playerTemplate = ['div', { className: 'row' },
        ['div', { className: `${color} icon` }],
        ['div', { className: 'name' }, username]
      ];
      const playerEle = html(playerTemplate);
      playersEle.append(playerEle);
    });
  };

  const main = () => {
    const url = '/api/game';
    fetch(url).then(res => res.json()).then(drawPlayers);
  };

  window.onload = main;
})();
