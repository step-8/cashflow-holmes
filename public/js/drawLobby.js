(function () {
  const addPlayerInfo = ({ color, username }, index) => {
    const playerEle = document.querySelector(`#player-${index + 1}`);
    const colorEle = playerEle.querySelector('.profile-color');
    const nameEle = playerEle.querySelector('.player-name');
    colorEle.replaceChildren();
    nameEle.innerText = username;
    colorEle.className = `${color} profile-color`;
  };

  const drawLobby = (xhr) => {
    const { gameId, players } = JSON.parse(xhr.response);
    const roomIdEle = document.querySelector('.room-id');
    roomIdEle.innerText = `Room Id : ${gameId}`;
    players.forEach(addPlayerInfo);
  };

  const main = () => {
    const req = { method: 'get', url: '/api/game' };
    xhrRequest(req, 200, drawLobby);
  };
  window.onload = main;
})();
