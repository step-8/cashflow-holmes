const children = {};

const loanActionOnEnter = (event, cb) => {
  if (event.key !== 'Enter') {
    return;
  }
  cb();
};

const createInputBox = (actionToCall) => {
  const loanOptions = getElement('#loan-options');

  return html(
    ['div', { className: 'flex-row flex-center gap' },
      ['div', {},
        ['input', {
          onkeyup: (event) => loanActionOnEnter(event, actionToCall), type: 'number', min: '0',
          placeholder: 'Enter amount', id: 'loan-amount', autofocus: 'true', required: 'true'
        }
        ]
      ],
      ['div', {
        className: 'fa-solid fa-check check',
        onclick: () => actionToCall()
      }
      ],
      ['div', {
        className: 'fa-solid fa-xmark close',
        onclick: () => {
          loanOptions.replaceChildren(...children.loanChildren);
        }
      }],
    ]
  );
};

const payBankLoan = (loanAmount) => {
  const amount = +getElement('#loan-amount').value;
  let message = 'Enter amount in K\'s';

  if (amount < 0 || amount % 1000) {
    drawLoanResult(message, 'warning');
    return;
  }

  if (amount > loanAmount) {
    message = `You have loan of $${loanAmount} only`;
    drawLoanResult(message, 'warning');
    return;
  }

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, type: 'bankLoan' })
  };

  API.payLoan(options)
    .then(res => decideLoanResult(res, 'payLoan'));
};

const payLoan = (event, liabilities) => {
  const select = getElement('#debt-options');
  const type = select.value;

  if (type === ' ') {
    return;
  }

  if (type === 'bankLoan') {
    const loanOptions = getElement('#loan-options');
    loanOptions.replaceChildren(createInputBox(() => payBankLoan(liabilities.bankLoan)));
    return;
  }

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, amount: liabilities[type] })
  };

  API.payLoan(options)
    .then(res => decideLoanResult(res, 'payLoan'));
};

const createDebtSelection = (liabilities) => {
  const debtOptions = Object.entries(liabilities);
  const debtSelection = html(['select', { name: 'pay-loan', id: 'debt-options' }, '']);
  debtSelection.append(html(['option', { value: ' ' }, '--Choose liability--']));

  debtOptions.forEach(([liability, amount]) => {
    const label = camelToCapitalize(liability);
    if (label === 'Real estates' || amount <= 0) {
      return;
    }

    const optionTemplate = ['option', { value: liability }, `${label} - $${amount}`];
    debtSelection.append(html(optionTemplate));
  });

  return debtSelection;
};

const drawLoanSelection = (event, liabilities) => {
  const loanOptions = getElement('#loan-options');
  const loanChildren = [...loanOptions.children];
  children.loanChildren = loanChildren;
  const debtSelection = createDebtSelection(liabilities);

  const selectAmount =
    ['div', { className: 'flex-row flex-center gap' },
      ['div', {}, debtSelection],
      ['div', {
        className: 'fa-solid fa-check check',
        onclick: (event) => payLoan(event, liabilities)
      }
      ],
      ['div', {
        className: 'fa-solid fa-xmark close',
        onclick: () => {
          loanOptions.replaceChildren(...loanChildren);
        }
      }]
    ];

  loanOptions.replaceChildren(html(selectAmount));
};

const drawLoan = (event) => {
  const loanOptions = getElement('#loan-options');
  const type = event.target.id;

  const loanChildren = [...loanOptions.children];
  children.loanChildren = loanChildren;

  const selectLoanAmount =
    createInputBox(takeLoan);

  loanOptions.replaceChildren(selectLoanAmount);
};

const replaceLoanElements = (id) => {
  getElement(id).
    replaceChildren(...children.loanChildren);
};

const drawLoanResult = (message, status) => {
  const classes = {
    success: 'success message',
    warning: 'warning message'
  };

  const loanOptions = getElement('#loan-options');

  loanOptions.replaceChildren(html(['div', { className: classes[status] }, message]));

  timeout(replaceLoanElements, 2000, '#loan-options');
};

const removeBankruptPopup = (id) => {
  getElement(id).remove();
};

const drawOutOfBankruptcy = () => {
  const bankruptEle = getElement('#bankrupt-popup');
  bankruptEle.replaceChildren('');

  const OutOfBankruptcy = ['div', { className: 'username' },
    'You are out of bankruptcy'
  ];

  bankruptEle.appendChild(html(OutOfBankruptcy));

  timeout(removeBankruptPopup, 5000, '#bankrupt-popup');
};

const sellAllAssets = () => {
  const options = {
    method: 'POST',
  };

  API.sellAllAssets(options)
    .then(res => {
      if (res.status > 400) {
        getElement('#bankrupt-popup').remove();
        return;
      }
      drawOutOfBankruptcy();
    });
};

const createBankruptPopup = () => {
  const popupTemplate =
    [
      'div', { className: 'escape-popup active flex-column flex-center gap', id: 'bankrupt-popup' },
      ['div', { className: 'username' }, 'You are going Bankrupt'],
      ['div', { className: 'button', onclick: sellAllAssets }, 'SELL']
    ];

  const pageWrapper = getElement('.page-wrapper');
  pageWrapper.appendChild(html(popupTemplate));
};

const decideLoanResult = (res, method) => {
  if (res.status === 200 && method === 'takeLoan') {
    drawLoanResult('Loan Taken Succesfully', 'success');
  }

  if (res.status === 200 && method === 'payLoan') {
    drawLoanResult('Loan Paid Successfully', 'success');
  }

  if (res.status === 406 && method === 'payLoan') {
    drawLoanResult('Insufficient Balance', 'warning');
  }
};

const takeLoan = () => {
  const amount = +getElement('#loan-amount').value;

  if (amount < 0 || amount % 1000) {
    const message = 'Enter amount in K\'s';
    drawLoanResult(message, 'warning');
    return;
  }

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount })
  };

  API.takeLoan(options)
    .then(res => decideLoanResult(res, 'takeLoan'));
};
