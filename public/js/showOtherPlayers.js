const findOtherPayers = (players, username) => {
  return players.filter(player => player.username !== username);
};

const closeOtherPlayers = () => {
  closeExpansion();
  const otherPlayersEle = getElement('#other-players');
  otherPlayersEle.remove();
};

const createOtherPlayersContainer = (players) => {
  const playersWrapper = ['div', { className: 'players-wrapper' }];

  players.forEach(player => {
    const icon = ['div', { className: `icon ${player.color}` }];
    const name = ['div', { className: 'name' }, player.username];
    const profession = ['div', { className: 'profession' }, player.profile.profession];
    const wrapper = ['div', { className: 'row' }, icon, name, profession];
    playersWrapper.push(wrapper);
  });

  return playersWrapper;
};

const generateOtherPlayers = (game, username) => {
  const { players } = game;
  const player = findPlayer(players, username);
  const otherPlayers = findOtherPayers(players, username);

  const otherPlayersTemplate =
    ['div', { id: 'other-players' },
      createExpansionHeader(player),
      createOtherPlayersContainer(otherPlayers),
      createCloseButton(closeOtherPlayers)
    ];

  const otherPlayersEle = html(otherPlayersTemplate);
  showWindow(otherPlayersEle);
};

const createOtherPlayers = (game) => {
  API.userInfo()
    .then(res => res.json())
    .then(userInfo => generateOtherPlayers(game, userInfo.username));

  return game;
};

const showOtherPlayers = () => {
  API.getGame()
    .then(res => res.json())
    .then(createOtherPlayers)
    .then(blurBackground);
};
