const removePopup = (event) => {
  const joinPopupEle = document.querySelector('.page-wrapper');
  joinPopupEle.remove();
};

const showInvalidMessage = (resolve) => {
  if (document.querySelector('.join-error')) {
    return;
  }

  let message = 'Invalid Game id';

  if (resolve.status === 423) {
    message = 'lobby is full';
  }

  if (resolve.status === 401) {
    reqPage('/host-lobby');
    return;
  }

  const pageEle = document.querySelector('#page-wrapper');
  const errorMessage = html(['div', { className: 'join-error' }, message]);
  pageEle.append(errorMessage);
};

const redirectToLobby = () => {
  reqPage('/guest-lobby');
};

const joinGame = (event) => {
  event.preventDefault();
  const body = readFormData('#join-popup-form');

  API.joinGame({ method: 'post', body })
    .then(resolve => {
      if (resolve.ok) {
        redirectToLobby();
        return;
      }
      showInvalidMessage(resolve);
    })
    .catch((err) => console.log('ERROR', err));
};

const createJoinPopup = (event) => {
  const joinTemplate =
    ['div', { className: 'page-wrapper', id: 'page-wrapper' },
      ['div', { className: 'join-popup-wrapper', id: 'join-popup' },
        [
          'form', { className: 'join-form', id: 'join-popup-form', onsubmit: (event) => joinGame(event) },
          ['input', { id: 'input-game-id', type: 'text', name: 'gameID', placeholder: 'Game id', autofocus: 'true', required: 'true', className: 'game-id large-font' }],
          ['div', { className: 'btn-wrapper large-font flex-column' },
            ['div', { id: 'enter-game', className: 'btn normal-font', onclick: (event) => joinGame(event) }, 'Enter'],
            ['div', { id: 'cancel-join-popup', className: 'btn normal-font', onclick: (event) => removePopup(event) }, 'Cancel']
          ]
        ]
      ]
    ];

  const joinHtml = html(joinTemplate);
  const bodyEle = document.querySelector('body');
  bodyEle.appendChild(joinHtml);
};
