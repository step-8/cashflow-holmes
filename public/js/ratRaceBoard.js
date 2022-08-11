(function () {
  const highlightCurrentPlayer = (game) => {
    const { username } = game.currentPlayer;
    const currentPlayerEle = document.querySelector(`#${username}`);
    currentPlayerEle.style.backgroundColor = 'lightgrey';
    currentPlayerEle.style.fontWeight = '900';
    return game;
  };

  const rollDice = () => {
    console.log('Rolling Dice');
    return;
  };

  const activateDice = (game) => {
    fetch('/get-user-info')
      .then(res => res.json())
      .then(userInfo => {
        if (userInfo.username === game.currentPlayer.username) {
          const dice = document.querySelector('#dice-box');
          dice.style.opacity = 1;
          dice.style.border = '2px solid black';
          dice.onclick = rollDice;
        }
      });
  };

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
        const playerTemplate = ['div', { className: 'row', id: username },
          ['div', { className: `${color} icon` }],
          ['div', { className: 'name' }, name]
        ];
        const playerEle = html(playerTemplate);
        playersEle.append(playerEle);
      });
    })
      .then(__ => highlightCurrentPlayer(game))
      .then(activateDice);
    return game;
  };

  const main = () => {
    fetch('/api/game').then(res => res.json())
      .then(drawPlayers);
  };

  window.onload = main;
})();
