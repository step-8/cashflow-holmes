const highlightCurrentPlayer = (game) => {
  const { username } = game.currentPlayer;
  const currentPlayerEle = document.querySelector(`#${username}`);
  currentPlayerEle.style.backgroundColor = 'lightgrey';
  currentPlayerEle.style.fontWeight = '900';
  return game;
};

const checkBankruptcy = () => {
  API.getGameJson()
    .then(game => {
      if (game.currentPlayer.aboutToBankrupt) {
        return createBankruptPopup();
      }
    });
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

const preAnimateDice = (game) => {
  const diceSet = new Set();
  [1, 2, 3, 4, 5, 6].forEach(item => diceSet.add(item));
  game.diceValues.forEach(val => diceSet.delete(val));
  
  const randDice = [...diceSet.values()].slice(0, 2);
  animateRollDice(randDice, game.diceValues);
  return game;
};

const rollDice = (game) => {
  const { currentPlayer: { canReRoll }, currentCard } = game;
  

  if (canReRoll && currentCard) {
    API.reRollDice()
      .then(drawLotteryMessage)
      .then(API.getGameJson()
        .then(preAnimateDice)
      );
    return;
  }

  const diceCount = getSelectedDice();
  API.rollDice(diceCount)
    .then(
      API.getGameJson()
        .then(preAnimateDice)
        .then(decideCard)
        .then());
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
        drawOneDice(diceValues);
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
    API.getGame()
      .then(res => res.json())
      .then(rollDice)
      .then(() => deactivateRoll(diceBox));
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
    return game;
  }

  deactivateRoll(diceBox);
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

const filterUserNotifications = (notifications, username) =>
  notifications.filter(notification => notification.username === username);

const createNotifications = (game) => {
  const { notifications, players, username } = game;
  const player = findPlayer(players, username);

  const userNotifications = filterUserNotifications(notifications, username);
  userNotifications.forEach(notification => {
    const { family } = notification;
    createNotification(game, family, player, 1);
    sendAction('ok', family, family);
    checkBankruptcy();
  });
};

const createNotification = (game, family, player, status) => {
  const message = getMessage(family, status, player);
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

  notificationsScreen.appendChild(notification);
};

const drawNotifications = (game) => {
  const { notifications } = game;
  if (!notifications.length) {
    return game;
  }

  createNotifications(game);

  if (game.currentPlayer.isInFastTrack) {
    return game;
  }

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

const drawOneDice = (diceValues) => {
  const secondDice = getElement('#dice-2-container');
  secondDice.style.display = 'none';
};

const drawTwoDices = (diceValues) => {
  const secondDice = getElement('#dice-2-container');
  secondDice.style.display = 'block';
};

const animateRollDice = ([value1, value2], next) => {
  const diceOne = getElement('#dice1');
  const diceTwo = getElement('#dice2');

  for (let side = 1; side <= 6; side++) {
    diceOne.classList.remove('show-' + side);
    if (value1 === side) {
      diceOne.classList.add('show-' + side);
    }
  }

  for (let side = 1; side <= 6; side++) {
    diceTwo.classList.remove('show-' + side);
    if (value2 === side) {
      diceTwo.classList.add('show-' + side);
    }
  }

  if (next) {
    setTimeout(() => {
      animateRollDice(next);
    }, 500);
  }
};

const drawDice = (game) => {
  const { diceValues, currentPlayer: { dualDiceCount, isRolledDice } } = game;
  
  if (isRolledDice) {
    return game;
  }
  if (dualDiceCount > 0) {
    drawTwoDices(diceValues);
    return game;
  }
  drawOneDice(diceValues); 
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
    deal: ['Insufficient balance. Take loan to proceed',
      'Successfully purchased',
      'Not enough stocks',
      'Successfully sold',
      'You won lottery',
      'You lost lottery'],
    market: ['You have no properties',
      'You have paid for the property damages',
      'You split the stocks',
      'You reverse split the stocks',
      'Insufficient gold coins',
      'Successfully sold gold coins',
      'Insufficient balance. Take loan to proceed',
      'Successfully sold real estate',],
    doodad: ['Insufficient balance. Take loan to proceed',
      'You are done with doodad',
      'You escaped from doodad'],
    charity: [
      'Insufficient balance. Take loan to proceed',
      'You donated to charity'],
    payday: [
      `Received payday of ${cashFlow}`,
      `Received payday of ${cashFlow} and won $500 in MLM`,
      `Received payday of ${cashFlow} and lost MLM`
    ],
    downsized: ['Insufficient balance. Take loan to proceed', 'You\'re downsized'],
    baby: ['', 'You got a new baby']
  };

  return messages[family][status];
};

const isTransactionCompleted = game => !game.transaction || !game.currentCard.id;
const isEveryoneResponded = (game) => game.turnResponses.every(({ responded }) => responded);

const message = (game, username) => {
  const { transaction: { family, status }, currentPlayer } = game;

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

const drawMessages = (game) => {
  const transactedUser = game.transaction?.username;
  if (transactedUser === game.username) {
    message(game, transactedUser);
  }

  if (isTransactionCompleted(game) || isEveryoneResponded(game)) {
    API.changeTurn();
    return;
  }
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
  const liabilities = player.profile.liabilities;

  const payLoan = getElement('#pay-loan');
  if (!payLoan) {
    return;
  }

  payLoan.onclick = (event) => drawLoanSelection(event, liabilities);
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
      ['div', { className: 'button', onclick: (event) => removePopUp('.escape-popup') }, 'OK']
    ];

  const pageWrapperEle = getElement('#escape-rat-race');
  pageWrapperEle.replaceChildren('');
  pageWrapperEle.appendChild(html(popupTemplate));
  blurBackground();
  
  if (currentPlayer.username === game.username) {
    timeout(() => API.changeTurn(), 5000);
  }
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
      .then(game => {
        return game;
      })
      .then(draw(gameState));
  }, 1000);
};

window.onload = main;
