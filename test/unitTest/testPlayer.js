const { Player } = require('../../src/models/player');
const professions = require('../../data/professions.json');
const { assert } = require('chai');

describe('Player', () => {
  const professionMain = JSON.stringify(professions[0]);

  it('Should get details of profile', () => {
    const profession = JSON.parse(professionMain);
    const player = new Player('p3', 'guest', 'red', profession);
    const expectedProfession = 'Doctor(MD)';
    assert.strictEqual(player.profile().profession, expectedProfession);
  });

  it('Should set defaults for the profile', () => {
    const profession = JSON.parse(professionMain);
    const player = new Player('p3', 'guest', 'red', profession);
    player.setDefaults();
    assert.strictEqual(player.profile().cash, 8400);
  });

  it('Should calculate the total income', () => {
    const profession = JSON.parse(professionMain);
    const player = new Player('p3', 'guest', 'red', profession);
    const expectedTotalIncome = 13200;
    assert.strictEqual(player.profile().totalIncome, expectedTotalIncome);
  });

  it('Should calculate the total expenses', () => {
    const profession = JSON.parse(professionMain);
    const player = new Player('p3', 'guest', 'red', profession);
    const expectedTotalExpenses = 8300;
    assert.strictEqual(player.profile().totalExpenses, expectedTotalExpenses);
  });

  it('Should calculate the cash flow', () => {
    const profession = JSON.parse(professionMain);
    const player = new Player('p3', 'guest', 'red', profession);
    const expectedCF = 4900;
    assert.strictEqual(player.profile().cashFlow, expectedCF);
  });

  it('Should calculate the passive income', () => {
    const profession = JSON.parse(professionMain);
    const player = new Player('p3', 'guest', 'red', profession);
    const expectedPassiveIncome = 0;
    assert.strictEqual(player.profile().passiveIncome, expectedPassiveIncome);
  });

  it('Should update current and last positions on movement', () => {
    const profession = JSON.parse(professionMain);
    const player = new Player('p3', 'guest', 'red', profession);
    player.move(3);
    assert.strictEqual(player.details.currentPosition, 3);
    assert.strictEqual(player.details.lastPosition, 0);
  });

  it('Should move to 24 if position is 0', () => {
    const profession = JSON.parse(professionMain);
    const player = new Player('p3', 'guest', 'red', profession);
    player.move(24);
    assert.strictEqual(player.details.currentPosition, 24);
  });

  describe('downsized', () => {
    it('Should not deduct amount from the cash', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      player.setDefaults();
      assert.isOk(player.downsized() !== 0);
      assert.strictEqual(player.profile().cash, 100);
    });

    it('Should deduct amount from the cash', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      player.setDefaults();
      player.payday();
      assert.isOk(player.downsized() === 1);
      assert.strictEqual(player.profile().cash, 5000);
    });
  });

  describe('donateCash', () => {
    it('Should not deduct amount from the cash', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      player.setDefaults();
      player.downsized();
      player.downsized();
      assert.isNotOk(player.charity());
    });

    it('Should deduct amount from the cash', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      player.setDefaults();
      assert.isOk(player.charity());
      assert.strictEqual(player.profile().cash, 7080);
    });
  });

  describe('buyStocks', () => {
    const card = {
      heading: 'New Card',
      symbol: 'a',
      price: 5,
      family: 'deal',
      type: 'stock'
    };

    it('Should not add stocks to the player', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      player.setDefaults();
      assert.isOk(player.buyStocks(card, 10000) === 0);
    });

    it('Should add stocks to the player', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      player.setDefaults();
      assert.isOk(player.buyStocks(card, 100) === 1);
      assert.deepStrictEqual(player.profile().assets.stocks[0].count, 100);
    });
  });

  describe('payday', () => {
    it('Should add cashflow amount to the cash', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      player.setDefaults();
      player.payday();
      assert.strictEqual(player.profile().cash, 13300);
    });
  });

  describe('doodad', () => {
    it('Should return true when cash is above 0', () => {
      const card = { isConditional: false, cost: 10 };
      const profession = JSON.parse(professionMain);

      const player = new Player('p3', 'guest', 'red', profession);
      player.setDefaults();
      assert.strictEqual(player.doodad(card), 1);
    });

    it('Should return false when cash is less than 0', () => {
      const card = { isConditional: false, cost: 10000 };
      const profession = JSON.parse(professionMain);

      const player = new Player('p3', 'guest', 'red', profession);
      assert.strictEqual(player.doodad(card), 0);
    });

    it('Should return 2 when player escaped from doodad', () => {
      const card = { isConditional: true, cost: 10000 };
      const profession = JSON.parse(professionMain);

      const player = new Player('p3', 'guest', 'red', profession);
      assert.strictEqual(player.doodad(card), 2);
    });
  });

  describe('lottery', () => {
    it('Should deduct lottery amount from the cash on successful purchase', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      player.setDefaults();
      player.buyLottery(100);
      assert.strictEqual(player.profile().cash, 8300);
    });

    it('Should not deduct lottery amount from the cash on unsuccessful purchase', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      player.setDefaults();
      player.buyLottery(100000);
      assert.strictEqual(player.profile().cash, 8400);
    });
  });

  describe('buyRealEstate', () => {
    it('Should not add asset if player has insufficient cash', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      const card = { downPayment: 300000 };
      player.setDefaults();
      player.doodad({ cost: 100 });
      const status = player.buyRealEstate(card);
      assert.isOk(!status);
    });

    it('Should add card to assets', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      const card = { downPayment: 300 };
      player.setDefaults();
      player.doodad(100);
      player.buyRealEstate(card);
      assert.deepStrictEqual(player.profile().assets.realEstates[0], card);
    });

    it('Should add card to liabilities', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      const card = { downPayment: 300 };
      player.setDefaults();
      player.doodad(100);
      player.buyRealEstate(card);
      assert.deepStrictEqual(player.profile().liabilities.realEstates[0], card);
    });

    it('Should add card to income', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      const card = { downPayment: 300 };
      player.setDefaults();
      player.doodad(100);
      player.buyRealEstate(card);
      assert.deepStrictEqual(player.profile().income.realEstates[0], card);
    });
  });


  describe('buyStocks', () => {
    const card = {
      heading: 'New Card',
      symbol: 'a',
      price: 5,
      family: 'deal',
      type: 'stock'
    };

    it('Should not add stocks to the player', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      player.setDefaults();
      assert.isOk(player.buyStocks(card, 10000) === 0);
    });

    it('Should add stocks to the player', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      player.setDefaults();
      assert.isOk(player.buyStocks(card, 100) === 1);
      assert.deepStrictEqual(player.profile().assets.stocks[0].count, 100);
    });
  });

  it('Should deduct cash from players profile in doodad', () => {
    const profession = JSON.parse(professionMain);
    const player = new Player('p3', 'guest', 'red', profession);
    player.setDefaults();
    assert.isOk(player.doodad(10));
  });

  describe('take loan', () => {
    it('Should add loan in players profile', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      assert.isOk(player.takeLoan(100));
    });

    it('Should add amount to the cash', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      player.setDefaults();
      const expected = player.profile();
      const expectedCash = expected.cash;
      const expectedBankLoanPayment = expected.expenses.bankLoanPayment;
      player.takeLoan(100);
      const actual = player.profile();

      assert.deepStrictEqual(actual.totalExpenses, expected.totalExpenses + 10);
      assert.deepStrictEqual(actual.cash, expectedCash + 100);
      assert.deepStrictEqual(actual.expenses.bankLoanPayment, expectedBankLoanPayment + 10);
    });
  });


  describe('pay loan', () => {
    it('Should deduct loan in players profile', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      player.takeLoan(100);
      assert.isOk(player.payLoan(100, 'bankLoan'));
    });

    it('Should deduct amount from the cash', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      player.setDefaults();
      player.takeLoan(100);
      const expected = player.profile();
      const expectedCash = player.profile().cash;
      const expectedBankLoanPayment = player.profile().expenses.bankLoanPayment;
      player.payLoan(100, 'bankLoan');
      const actual = player.profile();

      assert.deepStrictEqual(actual.totalExpenses, expected.totalExpenses - 10);
      assert.deepStrictEqual(actual.cash, expectedCash - 100);
      assert.deepStrictEqual(actual.expenses.bankLoanPayment, expectedBankLoanPayment - 10);
    });

    it('Should not deduct cash when player doesn\'t have sufficient cash', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      player.takeLoan(1100);
      player.doodad({ cost: 1100 });
      assert.isNotOk(player.payLoan(1500));
    });

    it('Should pay the loan amount of specified type', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      player.takeLoan(10000);
      assert.isOk(player.payLoan(10000, 'creditCardDebt'));
    });
  });

  describe('baby', () => {
    it('should add baby to the player', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      assert.isOk(player.baby());
    });

    it('Should not add baby when player have 3 babies', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      player.setDefaults();
      player.baby();
      player.baby();
      player.baby();
      assert.isOk(!player.baby());
    });
  });

  it('should initialize skipped turns count to 2', () => {
    const profession = JSON.parse(professionMain);
    const player = new Player('p3', 'guest', 'red', profession);
    player.initializeSkippedTurns();
    assert.strictEqual(player.skippedTurns, 2);
  });

  it('should decrement skipped turns count', () => {
    const profession = JSON.parse(professionMain);
    const player = new Player('p3', 'guest', 'red', profession);
    player.initializeSkippedTurns();
    player.decrementSkippedTurns();
    assert.strictEqual(player.skippedTurns, 1);
  });

  it('should increment dual dice count by 3', () => {
    const profession = JSON.parse(professionMain);
    const player = new Player('p3', 'guest', 'red', profession);
    player.incrementDualDiceCount();
    assert.strictEqual(player.dualDiceCount, 3);
  });

  it('should decrement dual dice count', () => {
    const profession = JSON.parse(professionMain);
    const player = new Player('p3', 'guest', 'red', profession);
    player.incrementDualDiceCount();
    player.decrementDualDiceCount();
    assert.strictEqual(player.dualDiceCount, 2);
  });

  describe('isIncomeStable', () => {
    it('Should return false when income is unstable', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      player.setDefaults();
      assert.isNotOk(player.isIncomeStable());
    });

    it('Should return true when income is stable', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      const card = { cashFlow: 100000, downPayment: 5 };
      player.setDefaults();
      player.buyRealEstate(card);
      assert.isOk(player.isIncomeStable());
    });
  });

  describe('payDamage', () => {
    it('Should return 0 if there is no realEstate', () => {
      const profession = JSON.parse(professionMain);
      const card = { cost: 400 };
      const player = new Player('p3', 'guest', 'red', profession);
      player.setDefaults();
      assert.isNotOk(player.payDamages(card));
      assert.strictEqual(player.profile().cash, 8400);
    });

    it('Should return 1 if there is realEstate and update cash', () => {
      const profession = JSON.parse(professionMain);
      const card = { cost: 400 };
      const asset = { cost: 100, downPayment: 100 };
      const player = new Player('p3', 'guest', 'red', profession);
      player.setDefaults();
      player.buyRealEstate(asset);
      assert.isOk(player.payDamages(card));
      assert.strictEqual(player.profile().cash, 7900);
    });

    it('Should return 6 if there is realEstate and not eno cash', () => {
      const profession = JSON.parse(professionMain);
      const card = { cost: 9000 };
      const asset = { cost: 100, downPayment: 100 };
      const player = new Player('p3', 'guest', 'red', profession);
      player.setDefaults();
      player.buyRealEstate(asset);
      assert.strictEqual(player.payDamages(card), 6);
      assert.strictEqual(player.profile().cash, 8300);
    });
  });

  describe('split stocks', () => {
    const card = {
      heading: 'New Card',
      symbol: 'a',
      price: 5,
      family: 'deal',
      type: 'stock'
    };

    it('Should split stocks to the player', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      player.setDefaults();
      player.buyStocks(card, 100);
      player.splitStocks(card);
      assert.deepStrictEqual(player.profile().assets.stocks[0].count, 200);
    });
  });

  describe('reverse split stocks', () => {
    const card = {
      heading: 'New Card',
      symbol: 'a',
      price: 5,
      family: 'deal',
      type: 'stock'
    };

    it('Should split stocks to the player', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      player.setDefaults();
      player.buyStocks(card, 100);
      player.reverseSplitStocks(card);
      assert.deepStrictEqual(player.profile().assets.stocks[0].count, 50);
    });
  });

  describe('addGoldCoins', () => {
    const card = {
      heading: 'gold',
      symbol: 'goldCoins',
      cost: 5,
    };

    it('Should add card to precious metals', () => {
      const profession = JSON.parse(professionMain);
      const player = new Player('p3', 'guest', 'red', profession);
      player.setDefaults();
      assert.isOk(player.addGoldCoins(card));
    });
  });

  describe('sellGoldCoins', () => {
    const card = {
      heading: 'New Card',
      symbol: 'GOLD',
      cost: 1000,
      family: 'market',
      type: 'goldCoins'
    };

    it('Should not sell if the count is exceeding the coins player has',
      () => {
        const profession = JSON.parse(professionMain);
        profession.assets.preciousMetals.push({ symbol: 'GOLD', count: 5, cost: 1000 });
        const player = new Player('p3', 'guest', 'red', profession);
        player.setDefaults();

        assert.isNotOk(player.sellGold(card, 10));

        const asset = player.profile().assets.preciousMetals[0];
        assert.strictEqual(asset.count, 5);
      });

    it('Should sell if the count is exceeding the coins player has',
      () => {
        const profession = JSON.parse(professionMain);
        profession.assets.preciousMetals.push({ symbol: 'GOLD', count: 5, cost: 1000 });
        const player = new Player('p3', 'guest', 'red', profession);
        player.setDefaults();

        assert.isOk(player.sellGold(card, 3));
        const asset = player.profile().assets.preciousMetals[0];
        assert.strictEqual(asset.count, 2);
      });
  });

  describe('sellRealEstate', () => {
    const card = {
      heading: 'New Card',
      symbol: 'GOLD',
      cost: 1000,
      family: 'market',
      type: 'goldCoins'
    };

    it('Should sell the given real estate',
      () => {
        const profession = JSON.parse(professionMain);
        profession.assets.realEstates.push(
          {
            id: 'realEstateB1',
            type: '8-PLEX',
            cost: 32000,
            downPayment: 40000,
            cashFlow: 1700
          });

        const player = new Player('p3', 'guest', 'red', profession);
        player.setDefaults();

        const card = {
          id: 'marketPlexBuyer01',
          symbol: 'PLEX',
          family: 'market',
          plus: true,
          value: 1000,
        };

        assert.isOk(player.sellRealEstate(card, 'realEstateB1'));
      });
  });
});
