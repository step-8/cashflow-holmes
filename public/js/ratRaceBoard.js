(function () {
  const highlightCurrentPlayer = (game) => {
    const { username } = game.currentPlayer;
    const currentPlayerEle = document.querySelector(`#${username}`);
    currentPlayerEle.style.backgroundColor = 'lightgrey';
    currentPlayerEle.style.fontWeight = '900';
    return game;
  };

  const rollDice = () => {
    fetch('/change-turn')
      .then(console.log('Here'));
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

  const diceFaces = {
    '1': ['div', { className: 'dice' }, ['div', { className: 'dot one-1' }]],
    '2': ['div', { className: 'dice' },
      ['div', { className: 'dot two-1' }],
      ['div', { className: 'dot two-2' }]],
    '3': ['div', { className: 'dice' },
      ['div', { className: 'dot three-1' }],
      ['div', { className: 'dot three-2' }],
      ['div', { className: 'dot three-3' }]],
    '4': ['div', { className: 'dice' },
      ['div', { className: 'dot four-1' }],
      ['div', { className: 'dot four-2' }],
      ['div', { className: 'dot four-3' }],
      ['div', { className: 'dot four-4' }]],
    '5': ['div', { className: 'dice' },
      ['div', { className: 'dot five-1' }],
      ['div', { className: 'dot five-2' }],
      ['div', { className: 'dot five-3' }],
      ['div', { className: 'dot five-4' }],
      ['div', { className: 'dot five-5' }]],
    '6': ['div', { className: 'dice' },
      ['div', { className: 'dot six-1' }],
      ['div', { className: 'dot six-2' }],
      ['div', { className: 'dot six-3' }],
      ['div', { className: 'dot six-4' }],
      ['div', { className: 'dot six-5' }],
      ['div', { className: 'dot six-6' }]],
  };

  const drawDice = (game) => {
    const diceValue = Math.ceil(Math.random() * 6);
    const dice = document.querySelector('.dice');
    dice.replaceWith(html(diceFaces[diceValue]));
    return game;
  };

  const main = () => {
    fetch('/api/game').then(res => res.json())
      .then(drawPlayers);
  };

  window.onload = main;
})();
