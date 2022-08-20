const drawTakeLoan = () => {
  const loanOptions = getElement('#loan-options');

  const actionsChildren = [...loanOptions.children];

  const selectLoanAmount =
    ['div', { className: 'selection-box' },
      ['div', {},
        ['input', { type: 'number', min: '0', placeholder: 'Enter amount', id: 'loan-amount' }]],
      ['div', {
        className: 'fa-solid fa-check check',
        onclick: takeLoan
      }],
      ['div', {
        className: 'fa-solid fa-xmark close',
        onclick: () => {
          loanOptions.replaceChildren(...actionsChildren);
        }
      }],
    ];

  loanOptions.replaceChildren(html(selectLoanAmount));
};

const takeLoan = () => {
  const amount = getElement('#loan-amount').value;

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount })
  };

  API.takeLoan(options)
    .then(res => console.log(res));
};
