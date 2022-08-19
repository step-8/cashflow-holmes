const expansionWindowScreens = {};

const classNames = {
  windowHeader: 'window-header',
  windowTitle: 'window-title',
};

const findPlayer = (players, playerName) => {
  return players.find(player => player.username === playerName);
};

const transactionItem = ({ currentCash, amount, description, totalCash }) => {
  return ['div', { className: 'ledger-entry' },
    ['div', { style: 'color:blue' }, currentCash],
    ['div', { style: `color:${amount >= 0 ? 'green' : 'red'}` },
      `$ ${amount >= 0 ? '+' : '-'}${Math.abs(amount)}`],
    ['div', {}, description],
    ['div', { style: 'color:blue' }, totalCash],
  ];
};

const windowHeader = ({ profession }, color, username) => {
  return ['div', { className: classNames.windowHeader },
    ['div', { className: classNames.windowTitle }, 'Ledger'],
    ['div', { className: 'my-details' },
      ['div', {},
        ['div', { id: 'username' }, username],
        ['div', { id: 'profession' }, profession],
      ],
      ['div', { className: `icon ${color}` }]
    ]
  ];
};

const ledgerHeader = () => {
  return [
    'div', { className: 'ledger-title' },
    ...['Current cash', 'Transaction amount', 'Description', 'Total cash'].map(
      heading => ['div', {}, heading])
  ];
};

const ledgerEntries = (transactions) =>
  ['div', { className: 'ledger-entries' }, ...transactions.map(transactionItem)];

const ledgerWindow = (profile, color, username, profession) => {
  return ['div', { className: 'ledger-window' },
    windowHeader(profession, color, username),
    ['div', { className: 'ledger-view' },
      ledgerHeader(),
      ledgerEntries(profile.transactions)
    ],
    ['div', { onclick: closeExpansion, className: 'close-btn' }, 'Close']
  ];
};

const createPlayerLedger = ({ profile, color, username, profession }) => {
  expansionWindowScreens.ledger = html(
    ledgerWindow(profile, color, username, profession)
  );
};

const createLedgerWindow = (game) => {
  API.userInfo()
    .then(res => res.json())
    .then(({ username }) => {
      const player = findPlayer(game.players, username);
      createPlayerLedger(player);
    });
};

const showMyLedger = () => {
  const placeHolder = getElement('.expansion-window-screen');
  placeHolder.replaceChildren('');
  placeHolder.appendChild(expansionWindowScreens.ledger);

  placeHolder.classList.remove('close-window');
  placeHolder.classList.remove('inactive');
  placeHolder.classList.add('expand-window');
  placeHolder.classList.add('active');
  placeHolder.style.visibility = 'visible';

  blurBackground();
};
