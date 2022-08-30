const decideCard = (game) => {
  API.assignCard();
  return game;
};

const submitOnEnter = (event, action, cardDetails) => {
  if (!isEnter(event)) {
    return;
  }

  submitValue(event, action, cardDetails);
};

const submitValue = (event, action, cardDetails) => {
  const inputDiv = getElement('#input-count') || getElement('#real-estate-options');
  const count = inputDiv.value;
  if (!count) {
    return;
  }
  const [type] = cardDetails.type.split('Others');
  sendAction(action, cardDetails.family, type, count);
};

const createRealEstateSelection = ({ realEstates }, { symbol }) => {
  const filtered = realEstates.filter(
    realEstate => realEstate.symbol.includes(symbol));
  
  const realEstateSelection = html(['select', { name: 'real-estate', id: 'real-estate-options' }, '']);
  realEstateSelection.append(html(['option', { value: ' ' }, '--Choose real estate--']));

  filtered.forEach(({ id, symbol, cashFlow, cost }) => {
    const optionTemplate = ['option',
      { value: id },
      `${symbol}, Cost: $${cost}, Cashflow: $${cashFlow}`
    ];
    realEstateSelection.append(html(optionTemplate));
  });

  return realEstateSelection;
};

const drawInputBox = (action, cardDetails, { profile }) => {
  const actions = getElement('.actions');
  const actionsChildren = [...actions.children];

  const dropDown = createRealEstateSelection(profile.assets, cardDetails);

  const input = ['input',
    {
      autofocus: 'true',
      required: 'true',
      onkeyup: event => submitOnEnter(event, action, cardDetails),
      type: 'number',
      min: '0',
      placeholder: 'Enter count',
      id: 'input-count'
    }
  ];

  const children = cardDetails.type === 'realEstate' && action === 'sell' ? dropDown : input;

  const selection =
    ['div', { className: 'selection-box' },
      ['div', {},
        children
      ],
      ['div', {
        className: 'fa-solid fa-check check',
        onclick: (event) => submitValue(event, action, cardDetails)
      }],
      ['div', {
        className: 'fa-solid fa-xmark close',
        onclick: (event) => {
          actions.replaceChildren(...actionsChildren);
        }
      }],
    ];

  actions.replaceChildren(html(selection));
};

const sendAction = (action, family, type, value) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: [
      `action=${action}`,
      `family=${family}`,
      `type=${type}`,
      `value=${value}`
    ].join('&')
  };

  API.cardAction(options);
  API.getGame()
    .then(res => res.json())
    .then(drawMessages);
};

const isInteractive = (action, type) => {
  const interactive = {
    buy: {
      stock: true,
      stockOthers: true
    },
    sell: {
      stock: true,
      stockOthers: true,
      goldCoins: true,
      goldCoinsOthers: true,
      realEstate: true,
      realEstateOthers: true
    }
  };
  return interactive[action]?.[type];
};

const performAction = (event, card, player) => {
  const { family, type } = card;
  const actionDiv = event.target;
  let [, action] = actionDiv.id.split('-');
  action = action === 'donate' ? 'ok' : action;

  if (isInteractive(action, type)) {
    drawInputBox(action, card, player);
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
    realEstateOthers: ['SELL', 'SKIP'],
    damage: ['OK'],
    lottery: ['ROLL'],
    goldCoins: ['SELL', 'SKIP'],
    goldCoinsOthers: ['SELL', 'SKIP']
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

const createActions = (card, type, asset, player) => {
  const { family } = card;
  const actionTexts = actions[family][type];
  return html(['div', { className: 'actions-wrapper' },
    ...actionTexts.map(action => {
      if (action === 'SELL' && !asset) {
        return ['span', { style: 'position:absolute' }];
      }
      return ['div',
        {
          className: 'button action-btn',
          id: `action-${action.toLowerCase()}`,
          onclick: (event) => {
            performAction(event, card, player);
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

const matchCard = (assets, symbol) => assets.find(
  asset => asset.symbol.includes(symbol));

const findAsset = (card, assets) => {
  const allAssets =
    [...assets.stocks, ...assets.preciousMetals, ...assets.realEstates];
  return matchCard(allAssets, card.symbol);
};

const multiUserFlow = (family, type) => {
  const multiFlows = {
    deal: {
      stock: true
    },
    market: {
      realEstate: true,
      goldCoins: true
    }
  };
  return multiFlows[family]?.[type];
};

const drawActions = (game) => {
  const { username, currentCard, currentPlayer, players, turnResponses } = game;
  const { family, type } = currentCard;
  const { assets } = currentPlayer.profile;
  const response = turnResponses.find(response => response.username === username);

  let actions = '';
  const asset = findAsset(currentCard, assets);
  const isCurrentUser = currentPlayer.username === username;
  const player = findPlayer(players, username);
  if (isCurrentUser && !response.responded) {
    actions = createActions(currentCard, type, asset, player);
  }

  if (multiUserFlow(family, type) && !isCurrentUser && !response.responded) {

    const { assets } = findPlayer(players, username).profile;
    const asset = findAsset(currentCard, assets);
    actions = createActions(currentCard, `${currentCard.type}Others`, asset, player);
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
