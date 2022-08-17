(function () {
  const drawLiabilites = (profession) => {
    const liabilityIds = [
      ['#home-mortgage', 'homeMortgage'],
      ['#school-loans', 'schoolLoans'],
      ['#car-loans', 'carLoans'],
      ['#credit-card-debt', 'creditCardDebt'],
    ];

    liabilityIds.forEach(([id, key]) => {
      const ele = getElement(id);
      ele.innerText = addDollar(profession.liabilities[key]);
    });
  };

  const drawExpenses = (profession) => {
    const expensesIds = [
      ['#taxes', 'taxes'],
      ['#home-mortgage-payment', 'homeMortgagePayment'],
      ['#school-loan-payment', 'schoolLoanPayment'],
      ['#car-loan-payment', 'carLoanPayment'],
      ['#credit-card-payment', 'creditCardPayment'],
      ['#bank-loan-payment', 'bankLoanPayment'],
      ['#other-expenses', 'otherExpenses'],
      ['#per-child-expense', 'perChildExpense']
    ];

    let totalExpenses = 0;

    expensesIds.forEach(([id, key]) => {
      const ele = getElement(id);
      ele.innerText = addDollar(profession.expenses[key]);
      totalExpenses += profession.expenses[key];
    });

    const totalExpensesEle = getElement('#total-expense');
    totalExpensesEle.innerText = addDollar(totalExpenses);

    const monthlyCFEle = getElement('#monthly-cashflow');
    monthlyCFEle.innerText = addDollar(profession.income.salary - totalExpenses);
  };

  const drawProfession = (playerProfession) => {
    const nameEle = getElement('#profession');
    nameEle.innerText = playerProfession.profession;

    const salaryEle = getElement('#salary');
    salaryEle.innerText = addDollar(playerProfession.income.salary);

    const savingsEle = getElement('#savings');
    savingsEle.innerText = addDollar(playerProfession.assets.savings);

    const incomeEle = getElement('#income');
    incomeEle.innerText = addDollar(playerProfession.income.salary);

    const totalIncomeEle = getElement('#total-income');
    totalIncomeEle.innerText = addDollar(playerProfession.income.salary);

    drawExpenses(playerProfession);
    drawLiabilites(playerProfession);
  };

  const createPlayers = ({ players }, { username }) => {
    const table = document.createElement('table');
    const heading = ['tr', {},
      ['th', {}, 'Player'],
      ['th', {}, 'Profession']
    ];
    table.appendChild(html(heading));

    players.forEach(player => {
      const playerName = player.username === username
        ? `${username} ⇦` : player.username;
      const playerTemplate = [
        'tr', {},
        ['td', {}, playerName],
        ['td', {}, player.profession.profession]
      ];
      table.appendChild(html(playerTemplate));
    });
    getElement('#other-players').prepend(table);
  };

  const drawPlayers = (game) => {
    API.userInfo()
      .then(res => res.json())
      .then(userInfo => {
        createPlayers(game, userInfo);
      });
  };

  const showProfession = () => {
    API.getProfession()
      .then(req => req.json())
      .then(drawProfession);

    API.getGame()
      .then(req => req.json())
      .then(drawPlayers);
  };
  window.onload = showProfession;
})();
