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

const createMyProfile = (game) => {
  const { username, color, profile } = game.currentPlayer;
  const { profession } = game.currentPlayer.profession;
  createExpensesTable(profile.expenses);

  const myProfileTemplate =
    ['div', { id: 'profile', className: 'profile-wrapper' },
      ['header', {},
        ['div', { className: 'board-name' }, 'Rat Race'],
        ['div', { className: 'my-details', },
          ['div', {},
            ['div', { id: 'username' }, username],
            ['div', { id: 'profession' }, profession],
          ],
          ['div', { className: `icon ${color}` }]
        ]
      ],
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
              ['h4', {}, 'Real estate :']
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
  return game;
};

const showMyProfile = () => {
  fetch('/api/game')
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
