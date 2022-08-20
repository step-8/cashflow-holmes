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
        ['input', { onkeyup: fnTocall, type: 'number', min: '0', placeholder: 'Enter amount in 1000s', id: 'loan-amount' }]],
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

const drawLoanResult = (message, status) => {
  const classes = {
    success: 'success message',
    warning: 'warning message'
  };

  const loanOptions = getElement('#loan-options');

  loanOptions.replaceChildren(html(['div', { className: classes[status] }, message]));

  setTimeout(() => {
    loanOptions.replaceChildren(...childrens.loanChildren);
  }, 2000);
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

  if (!amount) {
    return;
  }

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount })
  };

  const method = id === 'take-loan' ? 'takeLoan' : 'payLoan';

  API[method](options)
    .then(res => decideLoanResult(res, method));
};
