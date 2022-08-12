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
    window.location = '/';
  };

  const showCancelMessage = () => {
    const errorMessageDiv = document.querySelector('#message');
    errorMessageDiv.innerText = 'Game has been cancelled by host';
    errorMessageDiv.style.color = 'red';

    setTimeout(() => {
      const req = { method: 'get', url: '/remove-gameid' };
      xhrRequest(req, 200, redirectToMainMenu);
    }, 3000);

    return;
  };

  const drawLobby = (xhr) => {
    const { gameID, players, status } = JSON.parse(xhr.response);

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
      const req = { method: 'get', url: '/api/game' };
      xhrRequest(req, 200, drawLobby);
    }, 100);
  };
  window.onload = main;
})();
