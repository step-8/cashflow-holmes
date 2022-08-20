const childrens = {};

const drawTakeLoan = () => {
  const loanOptions = getElement('#loan-options');

  const loanChildren = [...loanOptions.children];
  childrens.loanChildren = loanChildren;
  const fnTocall = (event) => takeLoanOnEnter(event);

  const selectLoanAmount =
    ['div', { className: 'flex-row flex-center gap' },
      ['div', {},
        ['input', { onkeyup: fnTocall, type: 'number', min: '0', placeholder: 'Enter amount in 1000s', id: 'loan-amount' }]],
      ['div', {
        className: 'fa-solid fa-check check',
        onclick: takeLoan
      }],
      ['div', {
        className: 'fa-solid fa-xmark close',
        onclick: () => {
          loanOptions.replaceChildren(...loanChildren);
        }
      }],
    ];

  loanOptions.replaceChildren(html(selectLoanAmount));
};

const drawTakeLoanSuccess = (res) => {
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

const takeLoanOnEnter = (event) => {
  if (!isEnter(event)) {
    return;
  }
  takeLoan();
};

const takeLoan = (event) => {
  const amount = +getElement('#loan-amount').value;

  if (!amount) {
    return;
  }

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount })
  };

  API.takeLoan(options)
    .then(drawTakeLoanSuccess);
};
