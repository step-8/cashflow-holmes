
const verifyGameState = ({ players }) => {
  if (players.length < 2) {
    const errorMessageDiv = document.querySelector('#error-message');
    errorMessageDiv.innerText = 'Insufficient players(2 or more required).';

    setTimeout(() => {
      errorMessageDiv.innerText = '';
    }, 3000);
    return;
  }
  
  reqPage('/start-game');  
};

const startGame = () => {
  fetch('/api/game')
    .then(resolve => {
      if (resolve.status !== 200) {
        throw new Error('unable to fetch /api/game');
      }
      return resolve;
    })
    .then(resolve => resolve.json())
    .then(verifyGameState)
    .catch(error => console.log(error.message));
};
