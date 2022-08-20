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

const drawLoanResult = (res) => {
  const classes = {
    success: 'success message',
    warning: 'warning message'
  };

  const loanOptions = getElement('#loan-options');
  const message = 'Loan taken successfully';

  loanOptions.replaceChildren(html(['div', { className: classes.success }, message]));

  setTimeout(() => {
    loanOptions.replaceChildren(...childrens.loanChildren);
  }, 2000);
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
    .then(drawLoanResult);
};
