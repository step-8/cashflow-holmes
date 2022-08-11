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

  const drawProfession = (xhr) => {
    const profession = JSON.parse(xhr.response);
    const nameEle = getElement('#profession');
    nameEle.innerText = profession.profession;

    const salaryEle = getElement('#salary');
    salaryEle.innerText = addDollar(profession.income.salary);

    const savingsEle = getElement('#savings');
    savingsEle.innerText = addDollar(profession.assets.savings);

    const incomeEle = getElement('#income');
    incomeEle.innerText = addDollar(profession.income.salary);

    const totalIncomeEle = getElement('#total-income');
    totalIncomeEle.innerText = addDollar(profession.income.salary);

    drawExpenses(profession);
    drawLiabilites(profession);
  };

  const showProfession = () => {
    const req = { method: 'get', url: '/api/profession' };
    xhrRequest(req, 200, drawProfession);
  };
  window.onload = showProfession;
})();
