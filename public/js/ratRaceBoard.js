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

  class GameState {
    #log;
    #bankruptedPlayers;
    constructor(log) {
      this.#log = log;
      this.#bankruptedPlayers = [];
    }

    mergeLogs(logs) {
      return this.#log.mergeLogs(logs);
    }

    mergeBankruptedPlayers(players) {
      const unMergedPlayers = players.length - this.#bankruptedPlayers.length;

      if (unMergedPlayers <= 0) {
        return [];
      }
      this.#bankruptedPlayers = players;
      return this.#bankruptedPlayers.slice(-unMergedPlayers);
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

  const drawLotteryMessage = () => {
    API.getGame()
      .then(res => res.json())
      .then(drawMessages);
  };

  const rollDice = (game) => {
    const { currentPlayer: { canReRoll }, currentCard } = game;
    if (canReRoll && currentCard) {
      API.reRollDice()
        .then(drawLotteryMessage);
      return;
    }

    const diceCount = getSelectedDice();
    API.rollDice(diceCount)
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
    chooseDice.replaceChildren('');
    chooseDice.appendChild(html(createToggler(game)));
  };

  const resetToggler = () => {
    document.querySelector('#choose-dice').innerHTML = '';
  };

  const isEligibleToRoll = (you, currentPlayer) => {
    const { username, isRolledDice, skippedTurns } = currentPlayer;
    return you === username && !isRolledDice && skippedTurns === 0;
  };

  const activateRoll = (diceBox, game) => {
    diceBox.style.opacity = 1;
    diceBox.style.border = '2px solid black';
    diceBox.style.zIndex = 1;
    diceBox.style.boxShadow = 'grey 0px 0px 12px 6px';

    diceBox.onclick = () => {
      deactivateRoll(diceBox);
      API.getGame()
        .then(res => res.json())
        .then(rollDice);
    };
    drawForCurrentUser(drawToggle)(game);
  };

  const deactivateRoll = (diceBox) => {
    diceBox.style.opacity = 0.5;
    diceBox.style.zIndex = -1;
    diceBox.style.border = '2px dashed black';
    diceBox.style.boxShadow = 'none';
    diceBox.onclick = null;
    resetToggler();
  };

  const activateDice = (game) => {
    const { username, currentPlayer } = game;
    const diceBox = document.querySelector('#dice-box');

    if (isEligibleToRoll(username, currentPlayer)) {
      activateRoll(diceBox, game);
    } else {
      deactivateRoll(diceBox);
    }
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

  const buyStocksOnEnter = (event, action) => {
    if (!isEnter(event)) {
      return;
    }

    buyStocks(event, action);
  };

  const buyStocks = (event, action) => {
    const inputDiv = getElement('#stock-count');
    const stockCount = inputDiv.value;
    if (!stockCount) {
      return;
    }

    sendAction(action, 'deal', 'stock', stockCount);
  };

  const drawBuyStocks = (action) => {
    const actions = getElement('.actions');
    const actionsChildren = [...actions.children];

    const selectStockCount =
      ['div', { className: 'selection-box' },
        ['div', {},
          ['input',
            {
              autofocus: 'true',
              required: 'true',
              onkeyup: event => buyStocksOnEnter(event, action),
              type: 'number',
              min: '0',
              placeholder: 'Enter no of stocks',
              id: 'stock-count'
            }
          ]
        ],
        ['div', {
          className: 'fa-solid fa-check check',
          onclick: (event) => buyStocks(event, action)
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
      body: [
        `action=${action}`,
        `family=${family}`,
        `type=${type}`,
        `count=${count}`
      ].join('&')
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

    if ((action === 'buy' || action === 'sell') &&
      (type === 'stock' || type === 'stockOthers')) {
      drawBuyStocks(action);
      return;
    }

    sendAction(action, family, type);
  };

  const actions = {
    deal: {
      deal: ['SMALL', 'BIG'],
      realEstate: ['BUY', 'SKIP'],
      stock: ['BUY', 'SELL', 'SKIP'],
      stockOthers: ['SELL', 'SKIP'],
      lottery: ['BUY', 'SKIP'],
      mlm: ['ROLL', 'SKIP'],
      goldCoins: ['BUY', 'SKIP']
    },
    market: {
      realEstate: ['SELL', 'SKIP'],
      damage: ['OK'],
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

  const createActions = (family, type, stock) => {
    const actionTexts = actions[family][type];
    return html(['div', { className: 'actions-wrapper' },
      ...actionTexts.map(action => {
        if (action === 'SELL' && !stock) {
          return ['span', { style: 'position:absolute' }];
        }
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
    const { type, family } = currentCard;
    return cardTemplates[family][type](currentCard);
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

  const findStock = (card, assets) => {
    const stock = assets.stocks.find(stock => stock.symbol === card.symbol);
    return stock;
  };

  const isStock = (family, type) => family === 'deal' && type === 'stock';

  const drawActions = (game) => {
    const { username, currentCard, currentPlayer, players, turnResponses } = game;
    const { family, type } = currentCard;
    const { assets } = currentPlayer.profile;
    const response = turnResponses.find(response => response.username === username);

    let actions = '';
    const stock = findStock(currentCard, assets);
    const isCurrentUser = currentPlayer.username === username;

    if (isCurrentUser && !response.responded) {
      actions = createActions(family, type, stock);
    }

    if (isStock(family, type) && !isCurrentUser && !response.responded) {
      const { assets } = findPlayer(players, username).profile;
      const stock = findStock(currentCard, assets);
      actions = createActions(family, 'stockOthers', stock);
    }

    const actionsDiv = getElement('.actions');
    actionsDiv.replaceChildren('');
    actionsDiv.append(actions);
  };

  const createCard = (currentCard, currentPlayer) => {
    updateCurrentCardDetails(currentCard, currentPlayer);
    const cardTemplate = createCardTemplate(currentCard);
    const newCard = html(cardTemplate);
    newCard.classList.add(currentCard.family);
    addClasses(newCard, 'shadow');
    newCard.id = 'main-card';
    return newCard;
  };

  const removeCard = () => {
    const cardEle = getElement('#main-card');
    cardEle.innerHTML = '';
    cardEle.classList = '';
    return;
  };

  const createNotification = (game, family, currentPlayer, status, username) => {
    const message = getMessage(family, status, currentPlayer);
    const notificationsScreen = document.querySelector('#message-space');

    let notification = null;
    const notifyId = setTimeout(() => {
      notification.remove();
    }, 5000);

    notification = html(
      ['div', { className: `notify-wrapper ${family} fade-${family} fade shadow` },
        ['div', { className: 'notify-msg' }, message],
        ['div', {
          className: 'fa-solid fa-xmark close',
          onclick: (event) => {
            notification.remove();
            clearInterval(notifyId);
          }
        }],
      ]
    );
    if (game.username === username) {
      notificationsScreen.appendChild(notification);
    }
  };

  const drawNotifications = (game) => {
    const { notifications, currentPlayer } = game;
    if (!notifications.length) {
      return game;
    }

    const createNotifications = () => {
      notifications.forEach(notification => {
        const { family } = notification;
        createNotification(game, family, currentPlayer, 1, currentPlayer.username);
        const action = () => sendAction('ok', family, family);
        drawForCurrentUser(action)(game);
      });
    };

    drawForCurrentUser(createNotifications)(game);

    if (game.currentPlayer.isInFastTrack) {
      return;
    }

    API.changeTurn();
    return game;
  };

  const drawCard = (game) => {
    const { currentCard, currentPlayer } = game;
    const { canReRoll } = currentPlayer;
    const cardEle = getElement('#main-card');
    if (!currentCard || !currentCard.id) {
      removeCard();
      return;
    }


    const newCard = createCard(currentCard, currentPlayer);
    cardEle.replaceWith(newCard);

    if (canReRoll) {
      drawLottery(game);
      return;
    }

    drawActions(game);
    // drawActions(username, family, currentCard, currentPlayer, players);
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
      .then(drawNotifications)
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
    dice.replaceChildren('');
    dice.appendChild(createDice(diceValue));
  };

  const drawTwoDices = (diceValues) => {
    let newDiceValues = diceValues;
    if (newDiceValues.length < 2) {
      newDiceValues = [...diceValues, 1];
    }

    const dice = document.querySelector('#dice-box');
    dice.replaceChildren('');
    newDiceValues.forEach(diceValue => {
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

      if (currentPlayer.username === username) {
        playerIcon.classList.add('pulsate');
      } else {
        playerIcon.classList.remove('pulsate');
      }

      if (player.skippedTurns > 0) {
        const downsizedPosition = document.querySelector(`#rat-tile-12-${player.skippedTurns}`);
        downsizedPosition.append(playerIcon);
        return;
      }

      boardTile.appendChild(playerIcon);
    });
    return game;
  };

  const getMessage = (family, status, currentPlayer) => {
    const { cashFlow } = currentPlayer.profile;
    const messages = {
      deal: {
        0: 'Insufficient balance. Take loan to proceed',
        1: 'Successfully purchased',
        2: 'Not enough stocks',
        3: 'Successfully sold',
        4: 'You won lottery',
        5: 'You lost lottery'
      },
      market: {
        0: 'You have no properties',
        1: 'You have paid for the property damages',
        2: 'You split the stocks',
        3: 'You reverse split the stocks'
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
      },
      downsized: {
        0: 'Insufficient balance. Take loan to proceed',
        1: 'You\'re downsized'
      },
      baby: {
        1: 'You got a new baby'
      },
      'stocks-lottery': {
        0: 'You split the stocks',
        1: 'You reverse split the stocks'
      },
    };

    return messages[family][status];
  };

  const drawMessages = (game) => {
    if (!game.transaction || !game.currentCard.id) {
      API.changeTurn();
      return;
    }

    if (game.turnResponses.every(({ responded }) => responded)) {
      API.changeTurn();
      return;
    }

    const {
      transaction: { family, status, username },
      currentPlayer
    } = game;

    const message = () => {
      if (family === game.currentCard.family) {
        createNotification(game, family, currentPlayer, status, username);
        API.resetTransaction();
      }

      if (game.currentPlayer.isInFastTrack) {
        drawRatRaceCompletion(game);
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

  const addLogs = (game, gameState) => {
    const newLogs = gameState.mergeLogs(game.logs);
    if (newLogs.length <= 0) {
      return;
    }

    const logsDiv = document.querySelector('#logs');
    newLogs.forEach(log => {
      logsDiv.appendChild(html(createLog(log)));
    });

    logsDiv.scrollTop = logsDiv.scrollHeight;
  };

  const drawOutOfGamePopup = (game, gameState) => {
    const players = gameState.mergeBankruptedPlayers(game.bankruptedPlayers);
    if (players.length <= 0) {
      return;
    }

    const pageWrapper = getElement('.page-wrapper');

    players.forEach(player => {
      const outOfGameTemplate =
        ['div', { className: 'escape-popup', id: 'out-of-game-popup' },
          ['div', { className: 'username' }, `${player.username} has bankrupted`]
        ];

      pageWrapper.appendChild(html(outOfGameTemplate));
    });

    timeout(removePopUp, 3000, '#out-of-game-popup');

  };

  const decideLoanActions = (game) => {
    const username = game.username;
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
  };

  const drawLottery = (game) => {
    const { currentPlayer: { canReRoll } } = game;
    const actions = document.querySelector('.actions');
    if (!canReRoll || !actions) {
      return;
    }

    const rollDiceMsg = html(['div', { className: 'warning' }, 'Roll the dice.']);
    actions.replaceChildren('');
    actions.append(rollDiceMsg);
  };

  const removePopUp = (id) => {
    getElement(id).remove();
    API.changeTurn();
    removeBlurBackground();
  };

  const drawRatRaceCompletion = (game) => {
    const { currentPlayer } = game;
    if (!currentPlayer.isInFastTrack) {
      return;
    }

    const popupTemplate =
      [
        'div', { className: 'escape-popup active flex-column flex-center gap' },
        ['div', { className: 'username' }, `${currentPlayer.username} has escaped from Rat Race`],
        ['div', { className: 'button', onclick: () => removePopUp('.escape-popup') }, 'OK']
      ];

    const pageWrapperEle = getElement('#escape-rat-race');
    pageWrapperEle.replaceChildren('');
    pageWrapperEle.appendChild(html(popupTemplate));

    blurBackground();
  };

  const drawScreen = (game, gameState) => {
    drawPlayerPosition(game);
    drawPlayersList(game);
    addLogs(game, gameState);
    createExpansionWindows(game);
    drawRatRaceCompletion(game);
    drawLottery(game);
    drawOutOfGamePopup(game, gameState);
  };

  const prevState = { game: '' };

  const draw = (gameState) => {
    return res => {
      const newState = res.hash;
      decideLoanActions(res);
      if (newState !== prevState.game) {
        drawScreen(res, gameState);
        prevState.game = newState;
      }
    };
  };

  const main = () => {
    const logs = new Log();
    const gameState = new GameState(logs);

    setInterval(() => {
      API.getGame()
        .then(res => res.json())
        .then(draw(gameState));
    }, 1000);
  };

  window.onload = main;
})();
