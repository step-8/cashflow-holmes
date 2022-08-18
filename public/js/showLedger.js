const expansionWindowScreens = {};

const findPlayer = (players, playerName) => {
  return players.find(player => player.username === playerName);
};

const transactionItem = ({currentCash, amount, description, totalCash}) => ['div', { className: 'ledger-entry' },
  ['div', {}, currentCash],
  ['div', {style: `color:${amount >= 0 ? 'green': 'red'}` }, amount],
  ['div', {}, description],
  ['div', {}, totalCash],
];

const windowHeader = ({profession}, color, username) =>
  ['div', {},
    ['div', { className: 'window-title' }, 'Ledger'],
    ['div', { className: 'my-details', },
      ['div', {},
        ['div', { id: 'username' }, username],
        ['div', { id: 'profession' }, profession],
      ],
      ['div', { className: `icon ${color}` }]
    ]
  ];
      
const ledgerHeader = () => [
  'div', { className: 'ledger-title' },
  ...['Current Cash', 'Description', 'Total Cash'].map(
    heading => ['div', {}, heading])
];

const ledgerEntries = (transactions) =>
  ['div', { className: 'ledger-entries' }, ...transactions.map(transactionItem)];

const ledgerWindow =
  (profile, color, username, profession) => ['div', { className: 'ledger-window' },
    windowHeader(profession, color, username),
    ['div', { className: 'ledger-view' }, 
      ledgerHeader(),
      ledgerEntries(profile.transactions)
    ],
    ['div', { onclick: closeMyLedger, className: 'close-btn' }, 'CLOSE']
  ];

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
  placeHolder.appendChild(expansionWindowScreens.ledger);

  placeHolder.classList.remove('close-window');
  placeHolder.classList.remove('inactive');
  placeHolder.classList.add('expand-window');
  placeHolder.classList.add('active');
  placeHolder.innerHtml = '';
  placeHolder.style.visibility = 'visible';
  
  const boardEle = getElement('#board');
  boardEle.classList.add('inactive');

  blurBackground();
};

const closeMyLedger = () => {
  const placeHolder = getElement('.expansion-window-screen');
  placeHolder.classList.remove('expand-window');
  placeHolder.classList.remove('active');
  placeHolder.classList.add('close-window');
  placeHolder.classList.add('inactive');
  placeHolder.innerHtml = '';
  placeHolder.style.visibility = 'hidden';

  const boardEle = getElement('#board');
  boardEle.classList.remove('inactive');

  removeBlurBackground();
};
