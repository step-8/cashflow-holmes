const expansionWindowScreens = {};

const createExpansionWindows = ({ players, username }) => {
  const player = findPlayer(players, username);
  const { profile, color } = player;

  expansionWindowScreens.ledger = html(
    ledgerWindow(profile, color, username)
  );

  expansionWindowScreens.myProfile = generateProfile(player);
  expansionWindowScreens.otherPlayerProfiles = {};
  expansionWindowScreens.otherPlayersList =
    generateOtherPlayers(players, username);

  players.forEach(player => {
    const { username } = player;
    expansionWindowScreens.otherPlayerProfiles[username] =
      generateProfile(player);
  });
};
