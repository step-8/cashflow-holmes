const findOtherPayers = (players, username) => {
  return players.filter(player => player.username !== username);
};

const createOtherPlayerProfile = (username) => {
  showWindow('otherPlayerProfiles', username);
};

const createOtherPlayersContainer = (players) => {
  const playersWrapper = ['div', { className: 'players-wrapper' }];

  players.forEach(player => {
    const icon = ['div', { className: `icon ${player.color}` }];
    const name = ['div', { className: 'name' }, player.username];
    const profession = ['div', { className: 'profession' }, player.profile.profession];
    const wrapper = [
      'div',
      { className: 'player-row', onclick: () => createOtherPlayerProfile(player.username) },
      icon, name, profession
    ];
    playersWrapper.push(wrapper);
  });

  return playersWrapper;
};

const generateOtherPlayers = (players, username) => {
  const player = findPlayer(players, username);
  const otherPlayers = findOtherPayers(players, username);

  const otherPlayersTemplate =
    ['div', { id: 'other-players' },
      createExpansionHeader(player),
      createOtherPlayersContainer(otherPlayers),
      createCloseButton()
    ];

  return html(otherPlayersTemplate);
};
