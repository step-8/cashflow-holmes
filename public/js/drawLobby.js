(function () {
  const addPlayerInfo = ({ color, username, role }, index) => {
    const playerName = role === 'host' ? `${username} (${role})` : username;
    const template = [
      'div', { id: `player-${index + 1}`, className: 'player' },
      ['div', { className: `profile-color ${color}` }, ''],
      ['div', { className: 'player-name' }, playerName]
    ];

    return html(template);
  };

  const showCancelMessage = () => {
    const errorMessageDiv = document.querySelector('#message');
    errorMessageDiv.innerText = 'Game has been cancelled by host';
    errorMessageDiv.style.color = 'red';

    setTimeout(() => {
      API.cancelGame();
      reqPage('/');
    }, 2500);

    return;
  };

  const drawLobby = (response) => {
    const { players, status } = response;

    if (status === 'started') {
      reqPage('/show-profession');
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
      ['div', { className: 'profile-color' },
        ['img', { src: '/images/spinner.svg', alt: '...' }, '']
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
      API.getGame()
        .then(req => req.json())
        .then(drawLobby);
    }, 500);
  };
  window.onload = main;
})();
