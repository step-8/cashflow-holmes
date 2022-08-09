const verifyGameState = (xhr) => {
  const { players } = JSON.parse(xhr.response);
  if (players.length < 2) {
    const errorMessageDiv = document.querySelector('#error-message');
    errorMessageDiv.innerText = 'No other players joined in the game';

    setTimeout(() => {
      errorMessageDiv.innerText = '';
    }, 5000);
    return;
  }

  const req = { method: 'get', url: '/start-game' };
  xhrRequest(req, 200, showProfessions);
};

const startGame = (event) => {
  const req = { method: 'get', url: '/api/game' };
  xhrRequest(req, 200, verifyGameState);
};
