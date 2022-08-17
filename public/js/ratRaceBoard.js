(function () {
  class Log {
    #logs;

    constructor() {
      this.#logs = [];
    }

    mergeLogs(logs) {
      const unLoggedLogsLength = logs.length - this.#logs.length;

      if (unLoggedLogsLength <= 0) {
        return [];
      }
      this.#logs = logs;
      return logs.slice(-unLoggedLogsLength);
    }
  }

  const highlightCurrentPlayer = (game) => {
    const { username } = game.currentPlayer;
    const currentPlayerEle = document.querySelector(`#${username}`);
    currentPlayerEle.style.backgroundColor = 'lightgrey';
    currentPlayerEle.style.fontWeight = '900';
    return game;
  };

  const cardEvent = (type) => {
    API.assignCard(type);

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
    API.decideCard()
      .then(res => res.json())
      .then(drawDeals);
    return game;
  };

  const rollDice = () => {
    API.rollDice()
      .then(res => res)
      .then(API.getGame()
        .then(res => res.json())
        .then(decideCard));
    return;
  };

  const activateDice = (game) => {
    API.userInfo()
      .then(res => res.json())
      .then(userInfo => {
        const { username, isRolledDice } = game.currentPlayer;
        const dice = document.querySelector('#dice-box');
        if (userInfo.username === username && !isRolledDice) {
          dice.style.opacity = 1;
          dice.style.border = '2px solid black';
          dice.style.zIndex = 1;
          dice.onclick = rollDice;
        } else {
          dice.style.opacity = 0.5;
          dice.style.zIndex = -1;
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

  const createDoodadMessage = (message, className) => {
    const messageBox = getElement('#message-space');
    const messageEle = html(['div', { className }, message]);
    messageBox.appendChild(messageEle);

    setTimeout(() => {
      messageEle.remove();
    }, 2000);
  };

  const addDoodadMessage = (res) => {
    const messages = {
      200: 'You\'re done with doodad',
      207: 'Insufficient balance. Take loan to proceed'
    };

    createDoodadMessage(messages[200], 'success');

    if (res.status === 207) {
      message = messages[207];
      createDoodadMessage(message, 'warning');
    }

    return res;
  };

  const performAction = (event, family, type) => {
    const actionDiv = event.target;
    const [__, action] = actionDiv.id.split('-');
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `action=${action}&family=${family}&type=${type}`
    };
    API.cardAction(options)
      .then((res) => {
        if (family === 'doodad') {
          addDoodadMessage(res);
        }
        return res;
      })
      .then(() => {
        API.changeTurn();
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
            performAction(event, family, type);
          }
        },
        action
      ];
    })]);
  };

  const createCardTemplate = (currentCard) => {
    let { cost, downPayment } = currentCard;
    if (cost) {
      cost = `cost: ${currentCard.cost}`;
    }
    if (downPayment) {
      downPayment = `down payment: ${currentCard.downPayment}`;
    }

    return ['div', {},
      ['div', { className: 'card-heading' }, currentCard.heading.toUpperCase() || ''],
      ['div', { className: 'description' }, currentCard.description || ''],
      ['div', { className: 'rule' }, currentCard.rule || ''],
      ['div', { className: 'cost' }, cost || ''],
      ['div', { className: 'cost' }, downPayment || ''],
      ['div', { className: 'actions' }]
    ];
  };

  const updateCurrentCardDetails = (card, player) => {
    if (card.family === 'payday') {
      card.description = `Received pay of ${player.profile.cashFlow}`;
    }
    return;
  };

  const drawActions = (userInfo, family, currentCard, currentPlayer) => {
    const { username } = userInfo;
    let actions = '';
    if (currentPlayer.username === username) {
      actions = createActions(family, currentCard.type);
    }
    getElement('.actions').append(actions);
  };

  const createCard = (currentCard, currentPlayer, family) => {
    updateCurrentCardDetails(currentCard, currentPlayer);
    const cardTemplate = createCardTemplate(currentCard);
    const newCard = html(cardTemplate);
    newCard.classList.add(family);
    newCard.id = 'main-card';
    return newCard;
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

    const newCard = createCard(currentCard, currentPlayer, family);
    cardEle.replaceWith(newCard);

    API.userInfo()
      .then(res => res.json())
      .then(userInfo => {
        drawActions(userInfo, family, currentCard, currentPlayer);
      });
  };

  const drawPlayers = (game) => {
    const { players } = game;
    API.playerInfo()
      .then(res => res.json()).then(currentPlayer => {
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

  const createLog = (log) => {
    const userSpan = ['div', { className: `${log.color} icon log-icon`, }];
    return ['div', { className: 'log' }, userSpan, ['span', {}, `${log.message}`]];
  };

  const addLogs = (game, logs) => {
    const newLogs = logs.mergeLogs(game.logs);
    if (newLogs.length <= 0) {
      return;
    }

    const logsDiv = document.querySelector('#logs');
    newLogs.forEach(log => {
      logsDiv.appendChild(html(createLog(log)));
    });

    logsDiv.scrollTop = logsDiv.scrollHeight;
  };

  const main = () => {
    const logs = new Log();
    setInterval(() => {
      API.getGame()
        .then(res => res.json())
        .then(drawPlayerPosition)
        .then(drawPlayers)
        .then((game) => addLogs(game, logs));
    }, 1000);
  };

  window.onload = main;
})();
