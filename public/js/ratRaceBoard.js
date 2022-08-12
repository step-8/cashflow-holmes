(function () {
  const highlightCurrentPlayer = (game) => {
    const { username } = game.currentPlayer;
    const currentPlayerEle = document.querySelector(`#${username}`);
    currentPlayerEle.style.backgroundColor = 'lightgrey';
    currentPlayerEle.style.fontWeight = '900';
    return game;
  };

  const rollDice = () => {
    fetch('/roll-dice').then(res => res).then(fetch('/change-turn'));
    return;
  };

  const activateDice = (game) => {
    fetch('/get-user-info')
      .then(res => res.json())
      .then(userInfo => {
        const { username, isRolledDice } = game.currentPlayer;
        const dice = document.querySelector('#dice-box');
        if (userInfo.username === username && !isRolledDice) {
          dice.style.opacity = 1;
          dice.style.border = '2px solid black';
          dice.style.zIndex = 0;
          dice.onclick = rollDice;
        } else {
          dice.style.opacity = 0.5;
          dice.style.border = '2px dashed black';
          dice.onclick = null;
        }

      });
    return game;
  };

  const createIconEle = ({ color, username }) => {
    const iconTemplate = ['div', { className: `${color} icon`, id: `icon-${username}` }];
    return html(iconTemplate);
  };

  const createPlayerEle = (player, playerName) => {
    const { username, color } = player;
    let name = username;

    if (playerName === username) {
      name = username + '(you)';
    }
    const playerTemplate = ['div', { className: 'row', id: username },
      ['div', { className: `${color} icon` }],
      ['div', { className: 'name' }, name]
    ];

    return html(playerTemplate);
  };

  const drawStatus = (player) => {
    const { profile } = player;
    const cashEle = getElement('#total-cash');
    cashEle.innerText = addDollar(profile.cash);

    const cfEle = getElement('#cashflow-amount');
    cfEle.innerText = addDollar(profile.cashFlow);

    const expensesEle = getElement('#expenses');
    expensesEle.innerText = addDollar(profile.totalExpenses);

    const passiveIncome = getElement('#passive-income');
    passiveIncome.innerText = addDollar(profile.passiveIncome);

  };

  const drawPlayers = (game) => {
    const { players } = game;
    fetch('/api/player-info').then(res => res.json()).then(currentPlayer => {
      const playersEle = getElement('#players');
      playersEle.innerText = '';

      players.forEach(player => {
        const playerEle = createPlayerEle(player, currentPlayer.username);
        playersEle.append(playerEle);
      });

      drawStatus(currentPlayer);
    }).then(__ => highlightCurrentPlayer(game))
      .then(activateDice)
      .then(drawDice);
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
    const { diceValue } = game;
    const dice = document.querySelector('.dice');
    dice.replaceWith(html(diceFaces[diceValue]));
    return game;
  };

  const drawPlayerPosition = ({ players }) => {
    players.forEach((player) => {
      const { username, currentPosition } = player;
      let playerIcon = document.querySelector(`#icon-${username}`);

      if (playerIcon) {
        playerIcon.remove();
      }

      playerIcon = createIconEle(player);
      const boardTile = document.querySelector(`#rat-tile-${currentPosition}`);
      boardTile.appendChild(playerIcon);
    });
  };

  const main = () => {
    setInterval(() => {
      fetch('/api/game').then(res => res.json())
        .then(drawPlayers)
        .then(drawPlayerPosition);
    }, 500);
  };

  window.onload = main;
})();
