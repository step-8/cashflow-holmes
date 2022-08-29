const childrens = {};

const drawLoan = (event) => {
  const loanOptions = getElement('#loan-options');
  const type = event.target.id;

  const loanChildren = [...loanOptions.children];
  childrens.loanChildren = loanChildren;

  const fnTocall = (event) => loanActionOnEnter(event, type);

  const selectLoanAmount =
    ['div', { className: 'flex-row flex-center gap' },
      ['div', {},
        ['input', {
          onkeyup: fnTocall, type: 'number', min: '0', placeholder: 'Enter amount', id: 'loan-amount', autofocus: 'true', required: 'true'
        }
        ]
      ],
      ['div', {
        className: 'fa-solid fa-check check',
        onclick: () => loanActions(type)
      }
      ],
      ['div', {
        className: 'fa-solid fa-xmark close',
        onclick: () => {
          loanOptions.replaceChildren(...loanChildren);
        }
      }],
    ];

  loanOptions.replaceChildren(html(selectLoanAmount));
};

const replaceLoanElements = (id) => {
  getElement(id).
    replaceChildren(...childrens.loanChildren);
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
    drawLoanResult('Loan Paid Succesfully', 'success');
  }

  if (res.status === 406 && method === 'payLoan') {
    drawLoanResult('Insufficient Balance', 'warning');
  }
};

const loanActionOnEnter = (event, id) => {
  if (!isEnter(event)) {
    return;
  }
  loanActions(id);
};

const loanActions = (id) => {
  const amount = +getElement('#loan-amount').value;
  const method = id === 'take-loan' ? 'takeLoan' : 'payLoan';

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

  API[method](options)
    .then(res => decideLoanResult(res, method));
};
