class CardBuilder {
  constructor(card, contextElement) {
    this.card = card;
    this.contextElement = contextElement;
  }

  withRule() {
    this.contextElement.push(['div', { className: 'card-rule' }, this.card.rule || '']);
    return this;
  }

  withSubRule() {
    this.card.subRule.forEach(rule => {
      this.contextElement.push(['div', { className: 'card-sub-rule' }, rule]);
    });
    return this;
  }

  onlyCost() {
    this.contextElement.push(['div', { className: 'card-amount-block' },
      ['div', {}, `Cost: $${this.card.cost}`],
    ]);
    return this;
  }

  forStock() {
    this.contextElement.push(['div', { className: 'card-amount-block' },
      ['div', {}, `Symbol: ${this.card.symbol}`],
      ['div', {}, `Today's Price: $${this.card.price}`],
      ['div', {}, `Historic Trading Range: $${this.card.range[0]} - $${this.card.range[1]}`],
    ]);
    return this;
  }

  forRealEstate() {
    this.contextElement.push(['div', { className: 'card-amount-block' },
      ['div', {}, `Cost: $${this.card.cost}`],
      ['div', {}, `Mortgage: $${this.card.mortgage}`],
      ['div', {}, `Down Payment: $${this.card.downPayment}`],
      ['div', {}, `Cash Flow: +$${this.card.cashFlow}`]
    ]);
    return this;
  }

  forMarketStock() {
    this.contextElement.push(['div', { className: 'card-amount-block' },
      ['div', {}, `Symbol: ${this.card.symbol}`],
      ['div', {}, 'SPLIT or REVERSE ?'],
    ]);
    return this;
  }

  build() {
    return ['div', { className: 'card-wrapper' },
      ['div', { className: 'card-heading' }, this.card.heading],
      this.contextElement,
      ['div', { className: 'actions' }]
    ];
  }

  static #initialContextElement(card) {
    return ['div', { className: 'card-contents' },
      ['div', { className: 'card-description' }, card.description || ''],
    ];
  }

  static getInstanceWith(card) {
    return new CardBuilder(card, CardBuilder.#initialContextElement(card));
  }
}

const lotteryCard = card => CardBuilder.getInstanceWith(card)
  .withRule()
  .withSubRule()
  .onlyCost()
  .build();

const stocksCard = card => CardBuilder.getInstanceWith(card)
  .withRule()
  .forStock()
  .build();

const realEstateCard = card => CardBuilder.getInstanceWith(card)
  .withRule()
  .forRealEstate()
  .build();

const goldDealCard = card => CardBuilder.getInstanceWith(card)
  .withRule()
  .onlyCost()
  .build();

const doodadCard = (card) => ['div', { className: 'card-wrapper' },
  ['div', { className: 'card-heading' }, card.heading],
  ['div', { className: 'card-contents' },
    ['div', { className: 'card-rule' }, card.rule || ''],
    ['div', { className: 'card-amount-block' },
      ['div', {}, `Cost: $${card.cost}`],
    ]
  ],
  ['div', { className: 'actions' }]
];

const downsizedCard = card => CardBuilder.getInstanceWith(card)
  .withRule()
  .build();

const charityCard = card => CardBuilder.getInstanceWith(card)
  .withRule()
  .build();

const dealPopup = card => CardBuilder.getInstanceWith(card).build();

const marketRealEstate = card => CardBuilder.getInstanceWith(card).build();

const marketStockEvent = card => CardBuilder.getInstanceWith(card)
  .withRule()
  .withSubRule()
  .forMarketStock()
  .build();

const marketDamageEvent = card => CardBuilder.getInstanceWith(card)
  .withRule()
  .withSubRule()
  .onlyCost()
  .build();

const noCard = () => ['div', {}];

const cardTemplates = {
  deal: {
    deal: dealPopup,
    realEstate: realEstateCard,
    stock: stocksCard,
    lottery: lotteryCard,
    goldCoins: goldDealCard,
  },
  doodad: {
    doodad: doodadCard
  },
  payday: {
    payday: noCard
  },
  downsized: {
    downsized: downsizedCard
  },
  charity: {
    charity: charityCard
  },
  baby: {
    baby: noCard
  },
  market: {
    lottery: marketStockEvent,
    realEstate: marketRealEstate,
    damage: marketDamageEvent,
  },
};
