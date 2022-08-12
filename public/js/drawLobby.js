(function () {
  const addPlayerInfo = ({ color, username }, index) => {
    const template = [
      'div', { id: `player-${index + 1}`, className: 'player' },
      ['div', { className: `profile-color ${color}` }, ''],
      ['div', { className: 'player-name' }, username]
    ];

    return html(template);
  };

  const redirectToMainMenu = () => {
    const formEle = document.createElement('form');
    formEle.action = '/';
    formEle.submit();
  };

  const showCancelMessage = () => {
    const errorMessageDiv = document.querySelector('#message');
    errorMessageDiv.innerText = 'Game has been cancelled by host';
    errorMessageDiv.style.color = 'red';

    setTimeout(() => {
      fetch('/remove-gameid')
        .then(redirectToMainMenu);
    }, 3000);

    return;
  };

  const drawLobby = (response) => {
    const { gameID, players, status } = response;

    if (status === 'started') {
      showProfessions();
      return;
    }

    if (status === 'cancelled') {
      showCancelMessage();
      return;
    }

    const playersElement = document.querySelector('#players');
    playersElement.innerText = '';

    players.forEach((player, index) => {
      const playerEle = addPlayerInfo(player, index);
      playersElement.append(playerEle);
    });

    drawEmptyGrid(players.length);
  };

  const drawPlaceHolder = (id) => {
    const template = [
      'div', { id: `player-${id}`, className: 'player' },
      ['div', { className: 'profile-color grey' },
        ['i', { className: 'fa-solid fa-plus' }]
      ],
      ['div', { className: 'player-name' }, '']
    ];

    return html(template);
  };

  const drawEmptyGrid = (startingIndex) => {
    const playersElement = document.querySelector('#players');
    for (let index = startingIndex; index < 6; index++) {
      const placeHolder = drawPlaceHolder(index + 1);
      playersElement.append(placeHolder);
    }
  };

  const main = () => {
    setInterval(() => {
      fetch('/api/game')
        .then(req => req.json())
        .then(drawLobby);
    }, 500);
  };
  window.onload = main;
})();
