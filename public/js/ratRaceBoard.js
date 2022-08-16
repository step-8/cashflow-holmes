(function () {
  const highlightCurrentPlayer = (game) => {
    const { username } = game.currentPlayer;
    const currentPlayerEle = document.querySelector(`#${username}`);
    currentPlayerEle.style.backgroundColor = 'lightgrey';
    currentPlayerEle.style.fontWeight = '900';
    return game;
  };

  const cardEvent = (type) => {
    fetch(`/card/${type}`)
      .then(res => res.json());
    return type;
  };

  const chooseDealType = () => {
    const mainCard = getElement('#main-card');
    mainCard.className = 'deal';
    mainCard.innerText = '';
    const description = html(['div', { className: 'card-heading' }, 'Choose Big or Small deal ?']);
    const cardTemplate =
      [
        'div', { className: 'actions' },
        ['div', { className: ' button action-btn', id: 'small-deal', onclick: (event) => cardEvent('smallDeal') }, 'Small'],
        ['div', { className: ' button action-btn', id: 'big-deal', onclick: (event) => cardEvent('bigDeal') }, 'Big']
      ];

    const card = html(cardTemplate);
    mainCard.appendChild(description);
    mainCard.appendChild(card);
  };

  const drawDeals = (card) => {
    const { type } = card;
    if (type === 'deals') {
      chooseDealType();
      return card;
    }
    cardEvent(type);
    return card;
  };

  const decideCard = (game) => {
    fetch('/card/card-type')
      .then(res => res.json())
      .then(drawDeals);
    return game;
  };

  const rollDice = () => {
    fetch('/roll-dice')
      .then(res => res)
      .then(fetch('/api/game')
        .then(res => res.json())
        .then(decideCard));
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

  const performAction = (event, family) => {
    const actionDiv = event.target;
    const [__, action] = actionDiv.id.split('-');
    fetch('/card/card-action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `action=${action}&family=${family}`
    })
      .then(() => {
        fetch('/change-turn');
      });
  };

  const actions = {
    deal: {
      realEstate: ['BUY', 'SKIP'],
      stock: ['BUY', 'SKIP'],
      MLM: ['ROLL', 'SKIP'],
    },
    market: {
      realEstate: ['SELL', 'SKIP'],
      lottery: ['ROLL']
    },
    doodad: {
      doodad: ['OK']
    },
    payday: {
      payday: ['OK']
    },
    baby: {
      baby: ['OK']
    },
    charity: {
      charity: ['OK', 'SKIP']
    },
    downsized: {
      downsized: ['OK']
    }
  };

  const createActions = (family, type) => {
    const actionTexts = actions[family][type];
    return html(['div', { className: 'actions-wrapper' }, ...actionTexts.map(action => {
      return ['div',
        {
          className: 'button action-btn',
          id: `action-${action.toLowerCase()}`,
          onclick: (event) => {
            performAction(event, family);
          }
        },
        action
      ];
    })]);
  };

  const createCardTemplate = (currentCard) => {
    return ['div', {},
      ['div', { className: 'card-heading' }, currentCard.heading.toUpperCase() || ''],
      ['div', { className: 'description' }, currentCard.description || ''],
      ['div', { className: 'rule' }, currentCard.rule || ''],
      ['div', { className: 'cost' }, currentCard.cost || ''],
      ['div', { className: 'actions' }]
    ];
  };

  const updateCurrentCardDetails = (card, player) => {
    if (card.family === 'payday') {
      card.description = `Received pay of ${player.profile.cashFlow}`;
    }
    return;
  };

  const drawCard = (game) => {
    const { currentCard, currentPlayer } = game;
    if (currentCard === 'deals') {
      return;
    }

    const cardEle = getElement('#main-card');
    if (!currentCard) {
      cardEle.innerHTML = '';
      cardEle.classList = '';
      return;
    }

    let { family } = currentCard;
    const deals = ['smallDeal', 'bigDeal'];
    if (deals.includes(family)) {
      family = 'deal';
    }

    updateCurrentCardDetails(currentCard, currentPlayer);
    const cardTemplate = createCardTemplate(currentCard);
    const newCard = html(cardTemplate);
    newCard.classList.add(family);
    newCard.id = 'main-card';
    cardEle.replaceWith(newCard);

    let actions = null;
    fetch('/get-user-info')
      .then(res => res.json())
      .then(userInfo => {
        const { username } = userInfo;
        if (currentPlayer.username === username) {
          actions = createActions(family, currentCard.type);
          getElement('.actions').append(actions);
        }
      });
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
      .then(drawDice)
      .then(drawCard);
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

  const drawPlayerPosition = (game) => {
    const { players, currentPlayer } = game;
    players.forEach((player) => {
      const { username, currentPosition } = player;

      if (currentPlayer.username === username) {
        setTimeout(() => {
          const playerIcon = document.querySelector(`#icon-${username}`);
          const shadow = playerIcon.style.boxShadow;
          playerIcon.style.boxShadow = shadow ? 'none' : '0px 0px 2px 4px red';
        }, 100);
      }

      let playerIcon = document.querySelector(`#icon-${username}`);

      if (playerIcon) {
        playerIcon.remove();
      }

      playerIcon = createIconEle(player);
      const boardTile = document.querySelector(`#rat-tile-${currentPosition}`);
      boardTile.appendChild(playerIcon);
    });
    return game;
  };


  const main = () => {
    setInterval(() => {
      fetch('/api/game').then(res => res.json())
        .then(drawPlayerPosition)
        .then(drawPlayers);
    }, 500);
  };

  window.onload = main;
})();
