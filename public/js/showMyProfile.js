const blurBackground = () => {
  const boardEle = getElement('#board');
  boardEle.style.filter = 'blur(1.5px)';
  boardEle.classList.add('inactive');
};

const removeBlurBackground = () => {
  const boardEle = getElement('#board');
  boardEle.style.filter = 'blur(0px)';
  boardEle.classList.remove('inactive');
};

const createTwoColumnRow = (value1, value2) => {
  const element1 = ['td', {}, value1];
  const element2 = ['td', {}, value2];
  const row = ['tr', {}, element1, element2];
  return row;
};

const createThreeColumnRow = (value1, value2, value3) => {
  const element1 = ['td', {}, value1];
  const element2 = ['td', {}, value2];
  const element3 = ['td', {}, value3];
  const row = ['tr', {}, element1, element2, element3];
  return row;
};

const showWindow = (windowElements) => {
  const expansionEle = getElement('.expansion-window-screen');

  expansionEle.classList.remove('close-window');
  expansionEle.classList.remove('inactive');
  expansionEle.classList.add('expand-window');
  expansionEle.classList.add('active');
  expansionEle.replaceChildren('');
  expansionEle.appendChild(windowElements);

  expansionEle.style.visibility = 'visible';
};

const closeExpansion = () => {
  const expansionEle = getElement('.expansion-window-screen');
  expansionEle.replaceChildren('');

  expansionEle.classList.remove('expand-window');
  expansionEle.classList.remove('active');
  expansionEle.classList.add('close-window');
  expansionEle.classList.add('inactive');
  expansionEle.style.visibility = 'hidden';

  removeBlurBackground();
};

const createCloseButton = () => {
  return ['div', { className: 'close' },
    ['div', {
      className: 'close-btn',
      onclick: (event) => closeExpansion(event)
    }, 'Close']
  ];
};

const createExpansionHeader = ({ username, profession, color }) => {
  const professionName = profession.profession;
  return ['header', {},
    ['h3', { className: 'board-name small-font' }, 'Rat Race'],
    ['div', { className: 'my-details', },
      ['div', {},
        ['div', { id: 'username' }, username],
        ['div', { id: 'profession' }, professionName],
      ],
      ['div', { className: `icon  ${color}` }]
    ]
  ];
};

const createExpensesTable = (expenses, babies) => {
  const table = ['table', {}];
  const wrapper = ['tbody', {}];

  const expensesDetails = Object.entries(expenses);

  expensesDetails.forEach(([key, val]) => {
    if (key === 'perChildExpense') {
      key = `${key}: ${val} X (# of Children): ${babies}`;
      val = babies * val;
    }
    const expenseHeader = ['th', {}, camelToCapitalize(key)];
    const expenseValue = ['td', {}, val];
    const row = ['tr', {}, expenseHeader, expenseValue];
    wrapper.push(row);
  });

  table.push(wrapper);
  return table;
};

const createRealEstateIncome = ({ realEstates }) => {
  const table = ['table', {},
    ['thead', {},
      ['th', {}, 'Real Estate'],
      ['th', {}, 'Cash Flow'],
    ],
  ];

  const tbody = ['tbody', {}];
  realEstates.forEach(({ symbol, cashFlow }) => {
    const row = createTwoColumnRow(symbol, cashFlow);
    tbody.push(row);
  });

  table.push(tbody);
  return table;
};

const createRealEstateLiabilities = ({ realEstates }) => {
  const table = ['table', {},
    ['thead', {},
      ['th', {}, 'Real Estate'],
      ['th', {}, 'Mortgage'],
    ]
  ];

  const tbody = ['tbody', {}];
  realEstates.forEach(({ symbol, mortgage }) => {
    const row = createTwoColumnRow(symbol, mortgage);
    tbody.push(row);
  });

  table.push(tbody);
  return table;
};

const createRealEstateAssets = ({ realEstates }) => {
  const table = ['table', {},
    ['thead', {},
      ['th', {}, 'Real Estate'],
      ['th', {}, 'Down Payment'],
      ['th', {}, 'Cost'],
    ]
  ];

  const tbody = ['tbody', {}];
  realEstates.forEach(({ symbol, downPayment, cost }) => {
    const row = createThreeColumnRow(symbol, downPayment, cost);
    tbody.push(row);
  });

  table.push(tbody);
  return table;
};

const createStocksTable = ({ stocks }) => {
  const table = ['table', {},
    ['thead', {},
      ['th', {}, 'Stocks'],
      ['th', {}, '# of Shares'],
      ['th', {}, 'Cost'],
    ]
  ];

  const tbody = ['tbody', {}];
  stocks.forEach(({ symbol, count, price }) => {
    const row = createThreeColumnRow(symbol, count, price);
    tbody.push(row);
  });

  table.push(tbody);
  return table;
};

const createPreciousMetals = ({ preciousMetals }) => {
  const table = ['table', {},
    ['thead', {},
      ['th', {}, 'Metal Name'],
      ['th', {}, 'Cost'],
    ]
  ];

  const tbody = ['tbody', {}];
  preciousMetals.forEach(({ name, cost }) => {
    const row = createTwoColumnRow(name, cost);
    tbody.push(row);
  });

  table.push(tbody);
  return table;
};

const createLiabilitiesTable = ({ liabilities }) => {
  const wrapper = ['div', {}];

  const liabilitiesTable = ['table', {}];
  const liabilityWrapper = ['tbody', {}];
  const liabilityDetails = Object.entries(liabilities);

  liabilityDetails.forEach(([key, val]) => {
    if (key === 'realEstates') {
      return;
    }
    const liabilityHeader = ['th', {}, camelToCapitalize(key)];
    const liabilityValue = ['td', {}, val];
    const row = ['tr', {}, liabilityHeader, liabilityValue];
    liabilityWrapper.push(row);
  });

  const realEstateTable = createRealEstateLiabilities(liabilities);
  liabilitiesTable.push(liabilityWrapper);

  wrapper.push(liabilitiesTable, realEstateTable);

  return wrapper;
};

const generateProfile = (game, username) => {
  const { players } = game;
  const player = findPlayer(players, username);
  const { profile } = player;
  const myProfileTemplate =
    ['div', { id: 'profile', className: 'profile-wrapper' },
      createExpansionHeader(player),
      ['main', {},
        ['div', { className: 'income-statement' },
          ['h2', {}, 'Income statement'],
          ['div', { className: 'income-container' },
            ['div', { className: 'income' },
              ['h3', {}, 'Income'],
              ['div', { className: 'income-wrapper' },
                ['div', { className: 'salary-wrapper' },
                  ['h4', {}, 'Salary :'],
                  ['p', {}, profile.income.salary]
                ],
                createRealEstateIncome(profile.income),
              ],
              ['div', { className: 'total-income-wrapper' },
                ['div', {}, 'Total Income'],
                ['div', {}, profile.totalIncome]
              ]
            ],
            ['div', { className: 'expenses' },
              ['h3', {}, 'Expenses'],
              ['div', { className: 'expenses-wrapper' },
                createExpensesTable(profile.expenses, profile.babies)
              ],
              ['div', { className: 'total-expenses-wrapper' },
                ['div', {}, 'Total Expenses'],
                ['div', {}, profile.totalExpenses]
              ]
            ]
          ],
        ],
        ['div', { className: 'balance-sheet' },
          ['h2', {}, 'Balance sheet'],
          ['div', { className: 'balance-container' },
            ['div', { className: 'assets' },
              ['h3', {}, 'Assets'],
              ['div', { className: 'assets-wrapper' },
                ['div', { className: 'savings-wrapper' },
                  ['h4', {}, 'Savings :'],
                  ['p', {}, profile.assets.savings]
                ],
                createPreciousMetals(profile.assets),
                createStocksTable(profile.assets),
                createRealEstateAssets(profile.assets),
              ],
            ],
            ['div', { className: 'liabilities' },
              ['h3', {}, 'Liabilities'],
              ['div', { className: 'assets-wrapper' },
                createLiabilitiesTable(profile)
              ]
            ],
          ]
        ]
      ],
      createCloseButton()
    ];

  const myProfile = html(myProfileTemplate);
  showWindow(myProfile);
};

const createMyProfile = (game) => {
  API.userInfo()
    .then(res => res.json())
    .then(userInfo => generateProfile(game, userInfo.username));

  return game;
};

const showMyProfile = () => {
  API.getGame()
    .then(res => res.json())
    .then(createMyProfile)
    .then(blurBackground);
};
