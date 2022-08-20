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

  const decideCard = (game) => {
    API.assignCard();
    return game;
  };

  const getSelectedDice = () => {
    const diceVals = {
      'one': '1',
      'two': '2',
    };

    const diceDiv = document.querySelector('.selected');
    if (!diceDiv) {
      return diceVals['one'];
    }

    const [dice, __] = diceDiv.id.split('-');
    return diceVals[dice];
  };

  const rollDice = () => {
    const dice = getSelectedDice();
    API.rollDice(dice)
      .then(res => res)
      .then(API.getGame()
        .then(res => res.json())
        .then(decideCard));
    return;
  };

  const selectDiceOption = (event) => {
    const die = event.target.id;

    if (die === 'one-die') {
      document.querySelector('#one-die').className = 'dice-option selected';
      document.querySelector('#two-die').className = 'dice-option';
      return;
    }

    document.querySelector('#two-die').className = 'dice-option selected';
    document.querySelector('#one-die').className = 'dice-option';

  };

  const getDiceOptions = (id, diceValues) => {
    const diceOptions = {
      'one': {
        className: 'dice-option',
        onclick: (event) => {
          drawOneDice(diceValues[0]);
          selectDiceOption(event);
        },
        id: 'one-die'
      },
      'two': {
        className: 'dice-option selected',
        onclick: (event) => {
          drawTwoDices(diceValues);
          selectDiceOption(event);
        },
        id: 'two-die'
      }
    };
    return diceOptions[id];
  };


  const createToggler = (game) => {
    const { diceValues } = game;
    return ['div', { className: 'choice-wrapper' },
      ['div', getDiceOptions('one', diceValues), '1 Dice'],
      ['div', getDiceOptions('two', diceValues), '2 Dice']
    ];
  };

  const drawToggle = (game) => {
    const { currentPlayer: { dualDiceCount } } = game;
    const chooseDice = document.querySelector('#choose-dice');
    if (dualDiceCount <= 0) {
      return;
    }

    chooseDice.appendChild(html(createToggler(game)));
  };

  const resetToggler = () => {
    document.querySelector('#choose-dice').innerHTML = '';
  };

  const activateDice = (game) => {
    API.userInfo()
      .then(res => res.json())
      .then(userInfo => {
        const { username, isRolledDice } = game.currentPlayer;
        const diceBox = document.querySelector('#dice-box');

        // need to use css classes instead. classlist add/remove.
        if (userInfo.username === username && !isRolledDice) {
          diceBox.style.opacity = 1;
          diceBox.style.border = '2px solid black';
          diceBox.style.zIndex = 1;
          diceBox.onclick = rollDice;
          drawForCurrentUser(drawToggle)(game);
        } else {
          diceBox.style.opacity = 0.5;
          diceBox.style.zIndex = -1;
          diceBox.style.border = '2px dashed black';
          diceBox.onclick = null;
          resetToggler();
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

  const buyStocks = (event) => {
    const inputDiv = event.target.parentElement.firstChild;
    const stockCount = inputDiv.firstChild.value;
    if (!stockCount) {
      return;
    }

    sendAction('buy', 'deal', 'stock', stockCount);
  };

  const drawBuyStocks = () => {
    const actions = getElement('.actions');
    const actionsChildren = [...actions.children];

    const selectStockCount =
      ['div', { className: 'selection-box' },
        ['div', {},
          ['input', { type: 'number', min: '0', placeholder: 'Enter no of stocks' }]],
        ['div', {
          className: 'fa-solid fa-check check',
          onclick: buyStocks
        }],
        ['div', {
          className: 'fa-solid fa-xmark close',
          onclick: (event) => {
            actions.replaceChildren(...actionsChildren);
          }
        }],
      ];

    actions.replaceChildren(html(selectStockCount));
  };

  const sendAction = (action, family, type, count) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `action=${action}&family=${family}&type=${type}&count=${count}`
    };
    API.cardAction(options);
    API.getGame()
      .then(res => res.json())
      .then(drawMessages);
  };

  const performAction = (event, family, type) => {
    const actionDiv = event.target;
    let [, action] = actionDiv.id.split('-');
    action = action === 'donate' ? 'ok' : action;

    if (action === 'buy' && type === 'stock') {
      drawBuyStocks();
      return;
    }

    sendAction(action, family, type);
  };

  const actions = {
    deal: {
      deal: ['SMALL', 'BIG'],
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
      charity: ['DONATE', 'SKIP']
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
      ['div', { className: 'card-heading normal-font' }, currentCard.heading.toUpperCase() || ''],
      ['div', { className: 'description' }, currentCard.description || ''],
      ['div', { className: 'rule' }, currentCard.rule || ''],
      ['div', { className: 'cost small-font' }, cost || ''],
      ['div', { className: 'cost small-font' }, downPayment || ''],
      ['div', { className: 'actions' }]
    ];
  };

  const updateCurrentCardDetails = (card, player) => {
    if (card.family === 'payday') {
      card.description = `Received pay of ${player.profile.cashFlow}`;
    }

    if (card.type === 'stock') {
      card.cost = card.price;
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

  const createCard = (currentCard, currentPlayer) => {
    updateCurrentCardDetails(currentCard, currentPlayer);
    const cardTemplate = createCardTemplate(currentCard);
    const newCard = html(cardTemplate);
    newCard.classList.add(currentCard.family);
    newCard.id = 'main-card';
    return newCard;
  };

  const removeCard = () => {
    const cardEle = getElement('#main-card');
    cardEle.innerHTML = '';
    cardEle.classList = '';
    return;
  };

  const timeout = (fn, time) => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        try {
          res(fn());
        } catch (err) {
          rej(err);
        }
      }, time);
    });
  };

  const removeNotification = (currentCard, card, game) => {
    removeCard();
    const action = () => sendAction('ok', card.family, card.type);
    drawForCurrentUser(action)(game);
    API.removeNotification();
  };

  const drawNotifications = (cardEle, game) => {
    const { currentPlayer } = game;
    const currentCard = game.currentCard;
    const notifications = currentCard.notifications;
    const card = notifications[0];

    const newCard = createCard(card, currentPlayer);
    cardEle.replaceWith(newCard);

    timeout(() => removeNotification(currentCard, card, game), 2000);
    return;
  };

  const drawCard = (game) => {
    const { currentCard, currentPlayer } = game;
    const cardEle = getElement('#main-card');

    if (!currentCard) {
      removeCard();
      return;
    }

    if (currentCard.notifications.length) {
      drawNotifications(cardEle, game);
      return;
    }

    if (!currentCard.id) {
      removeCard();
      return;
    }

    const { family } = currentCard;
    const newCard = createCard(currentCard, currentPlayer);
    cardEle.replaceWith(newCard);

    API.userInfo()
      .then(res => res.json())
      .then(userInfo => {
        drawActions(userInfo, family, currentCard, currentPlayer);
      });
  };

  const drawPlayersList = (game) => {
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

  const createDice = (diceValue) => html(diceFaces[diceValue]);
  const drawOneDice = (diceValue) => {
    const dice = document.querySelector('#dice-box');
    dice.innerHTML = '';
    dice.appendChild(createDice(diceValue));
  };

  const drawTwoDices = (diceValues) => {
    const dice = document.querySelector('#dice-box');
    dice.innerHTML = '';
    diceValues.forEach(diceValue => {
      dice.appendChild(createDice(diceValue));
    });

  };

  const drawDice = (game) => {
    const { diceValues, currentPlayer: { dualDiceCount } } = game;

    if (dualDiceCount > 0) {
      drawTwoDices(diceValues);
      return game;
    }

    drawOneDice(diceValues[0]);
    return game;
  };

  const drawPlayerPosition = (game) => {
    const { players, currentPlayer } = game;

    players.forEach((player) => {
      const { username, currentPosition } = player;
      const boardTile = document.querySelector(`#rat-tile-${currentPosition}`);
      let playerIcon = document.getElementById(`icon-${username}`);

      if (!playerIcon) {
        playerIcon = createIconEle(player);
      }
      boardTile.appendChild(playerIcon);

      if (currentPlayer.username === username) {
        playerIcon.classList.add('pulsate');
      } else {
        playerIcon.classList.remove('pulsate');
      }
    });
    return game;
  };

  const createMessage = (message, className) => {
    const messageBox = getElement('#message-space');
    const messageEle = html(['div', { className: `${className} normal-font` }, message]);
    messageBox.replaceChildren(messageEle);
    API.resetTransaction();
    API.changeTurn();

    setTimeout(() => {
      messageEle.remove();
    }, 2000);
  };

  const getMessage = (family, status, currentPlayer) => {
    const cashFlow = currentPlayer.profile.cashFlow;
    const messages = {
      deal: {
        0: 'Insufficient balance. Take loan to proceed',
        1: 'Successfully purchased'
      },
      doodad: {
        0: 'Insufficient balance. Take loan to proceed',
        1: 'You are done with doodad'
      },
      charity: {
        0: 'Insufficient balance. Take loan to proceed',
        1: 'You donated to charity'
      },
      payday: {
        1: `Received payday of ${cashFlow}.`
      }
    };

    return messages[family][status];
  };

  const classes = {
    0: 'warning message',
    1: 'success message'
  };

  const drawMessages = (game) => {
    if (!game.transaction || !game.currentCard) {
      API.changeTurn();
      return;
    }

    const { transaction: { family, status }, currentPlayer } = game;
    const message = () => {
      if (family === game.currentCard.family) {
        const actionMessage = getMessage(family, status, currentPlayer);
        createMessage(actionMessage, classes[status]);
        return;
      }
      API.changeTurn();
    };

    drawForCurrentUser(message)(game);
  };

  const createLog = (log) => {
    const userSpan = ['div', { className: `${log.color} icon log-icon`, }];
    return ['div', { className: 'log' }, userSpan, ['span', { className: 'log-msg' }, `${log.message}`]];
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


  const decideLoanActions = (game) => {
    API.userInfo()
      .then(res => res.json())
      .then(({ username }) => {
        const player = findPlayer(game.players, username);
        const loan = player.profile.liabilities.bankLoan;
        const payLoanEle = getElement('#pay-loan');
        if (!payLoanEle) {
          return;
        }
        payLoanEle.onclick = (event) => event;
        if (loan > 0) {
          payLoanEle.onclick = (event) => drawLoan(event);
        }
      });
  };

  const drawScreen = (game, logs) => {
    drawPlayerPosition(game);
    drawPlayersList(game);
    addLogs(game, logs);
    createLedgerWindow(game);
  };

  const prevState = { game: '' };

  const draw = (logs) => {
    return res => {
      const newState = res.stateHash;
      decideLoanActions(res);
      if (newState !== prevState.game) {
        drawScreen(res, logs);
        prevState.game = newState;
      }
    };
  };

  const main = () => {
    const logs = new Log();

    setInterval(() => {
      API.getGame()
        .then(res => res.json())
        .then(draw(logs));
    }, 500);
  };

  window.onload = main;
})();
