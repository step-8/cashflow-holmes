const createExpensesTable = (expenses) => {
  const wrapper = ['table', {}];
  const expensesDetails = Object.entries(expenses);

  expensesDetails.forEach(([key, val]) => {
    const expenseHeader = ['th', {}, key];
    const expenseValue = ['td', {}, val];
    const row = ['tr', {}, expenseHeader, expenseValue];
    wrapper.push(row);
  });

  return wrapper;
};

const blurBackground = () => {
  const boardEle = getElement('#board');
  boardEle.style.filter = 'blur(2px)';
};

const removeBlurBackground = () => {
  const boardEle = getElement('#board');
  boardEle.style.filter = 'blur(0px)';
};

const findPlayer = (players, { username }) => {
  return players.find(player => player.username === username);
};

const createProfileHeader = ({ username, profession, color }) => {
  const professionName = profession.profession;
  return ['header', {},
    ['div', { className: 'board-name' }, 'Rat Race'],
    ['div', { className: 'my-details', },
      ['div', {},
        ['div', { id: 'username' }, username],
        ['div', { id: 'profession' }, professionName],
      ],
      ['div', { className: `icon ${color}` }]
    ]
  ];
};

const createRealEstateTable = ({ realEstates }) => {
  return ['div', {}];
};

const generateProfile = (game, userInfo) => {
  const { players } = game;
  const player = findPlayer(players, userInfo);
  const { profile } = player;

  const myProfileTemplate =
    ['div', { id: 'profile', className: 'profile-wrapper' },
      createProfileHeader(player),
      ['main', {},
        ['div', { className: 'income-statement' },
          ['h2', {}, 'Income statement'],
          ['div', { className: 'income-container' },
            ['div', { className: 'income' },
              ['h3', {}, 'Income'],
              ['div', { className: 'salary-wrapper' },
                ['h4', {}, 'Salary :'],
                ['p', {}, profile.income.salary]
              ],
              ['h4', {}, 'Real estate :'],
              createRealEstateTable(profile.income)
            ],
            ['div', { className: 'expenses' },
              ['h3', {}, 'Expenses'],
              createExpensesTable(profile.expenses)
            ]
          ],
        ],
        ['div', { className: 'balance-sheet' },
          ['h2', {}, 'Balance sheet'],
          ['div', { className: 'balance-container' },
            ['div', { className: 'assets' },
              ['h3', {}, 'Assets']
            ],
            ['div', { className: 'liabilities' },
              ['h3', {}, 'Liabilities']
            ],
          ]
        ]
      ],
      ['div', { className: 'close' },
        ['div', {
          className: 'close-btn',
          onclick: (event) => closeMyProfile(event)
        }, 'close']
      ]
    ];

  const myProfile = html(myProfileTemplate);
  const expansionEle = getElement('#expansion-window');
  expansionEle.style.zIndex = 2;
  expansionEle.replaceChildren('');
  expansionEle.appendChild(myProfile);
};

const createMyProfile = (game) => {
  API.userInfo()
    .then(res => res.json())
    .then(userInfo => generateProfile(game, userInfo));

  return game;
};

const showMyProfile = () => {
  API.getGame()
    .then(res => res.json())
    .then(createMyProfile)
    .then(blurBackground);
};

const closeMyProfile = (event) => {
  const expansionEle = getElement('#expansion-window');
  expansionEle.style.zIndex = -1;
  const profileEle = getElement('#profile');
  profileEle.remove();
  removeBlurBackground();
};
