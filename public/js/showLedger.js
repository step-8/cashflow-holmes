const classNames = {
  windowHeader: 'window-header',
  windowTitle: 'window-title',
};

const transactionItem = ({ currentCash, amount, description, totalCash }) => {
  return ['div', { className: 'ledger-entry' },
    ['div', {}, addDollar(currentCash)],
    ['div', { style: `color:${amount >= 0 ? 'green' : 'red'}` },
      addDollar(Math.abs(amount))],
    ['div', {}, description],
    ['div', {}, addDollar(totalCash)],
  ];
};

const windowHeader = (profession, color, username) => {
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

const ledgerWindow = (profile, color, username) => {
  return ['div', { className: 'ledger-window' },
    windowHeader(profile.profession, color, username),
    ['div', { className: 'ledger-view' },
      ledgerHeader(),
      ledgerEntries(profile.transactions)
    ]
  ];
};
