const expansionWindowScreens = {};

const findPlayer = (players, playerName) => {
  return players.find(player => player.username === playerName);
};

const createPlayerLedger = ({ profile, color, username}) => {
  const element = ['div', {}, username,
    ['div', { onclick: closeMyLedger, className: 'close-btn' }, 'CLOSE']];
  expansionWindowScreens.ledger = html(element);
};

const createLedgerWindow = (game) => {
  API.userInfo()
    .then(res => res.json())
    .then(({ username }) => {
      const player = findPlayer(game.players, username);
      createPlayerLedger(player);
    });
};

const showMyLedger = () => {
  const placeHolder = getElement('.expansion-window-screen');
  placeHolder.appendChild(expansionWindowScreens.ledger);

  placeHolder.classList.remove('close-window');
  placeHolder.classList.remove('inactive');
  placeHolder.classList.add('expand-window');
  placeHolder.classList.add('active');
  placeHolder.innerHtml = '';
  placeHolder.style.visibility = 'visible';
  
  const boardEle = getElement('#board');
  boardEle.classList.add('inactive');

  blurBackground();
};

const closeMyLedger = () => {
  const placeHolder = getElement('.expansion-window-screen');
  placeHolder.classList.remove('expand-window');
  placeHolder.classList.remove('active');
  placeHolder.classList.add('close-window');
  placeHolder.classList.add('inactive');
  placeHolder.innerHtml = '';
  placeHolder.style.visibility = 'hidden';

  const boardEle = getElement('#board');
  boardEle.classList.remove('inactive');

  removeBlurBackground();
};
