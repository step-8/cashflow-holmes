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

  const { origin } = window.location;
  const url = '/show-profession';
  window.location.replace(`${origin}${url}`);
};

const startGame = (event) => {
  const req = { method: 'get', url: '/api/game' };
  xhrRequest(req, 200, verifyGameState);
};
