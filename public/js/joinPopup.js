const removePopup = (event) => {
  const joinPopupEle = document.querySelector('.page-wrapper');
  joinPopupEle.remove();
};

const showInvalidMessage = (xhr) => {
  if (document.querySelector('.join-error')) {
    return;
  }

  let message = 'Invalid Game id';

  if (xhr.status === 423) {
    message = 'lobby is full';
  }

  if (xhr.status === 401) {
    window.location = '/host-lobby';
    return;
  }

  const pageEle = document.querySelector('#page-wrapper');
  const errorMessage = html(['div', { className: 'join-error' }, message]);
  pageEle.append(errorMessage);
};

const redirectToLobby = () => {
  window.location = '/guest-lobby';
};

const joinGame = (event) => {
  event.preventDefault();
  const body = readFormData('#join-popup-form');
  const req = { method: 'post', url: '/join' };
  xhrRequest(req, 200, redirectToLobby, showInvalidMessage, body);
};

const createJoinPopup = (event) => {
  const joinTemplate =
    ['div', { className: 'page-wrapper', id: 'page-wrapper' },
      ['div', { className: 'join-popup-wrapper', id: 'join-popup' },
        [
          'form', { className: 'join-form', id: 'join-popup-form', onsubmit: (event) => joinGame(event) },
          ['input', { type: 'text', name: 'gameID', placeholder: 'Game id', autofocus: 'true', required: 'true', className: 'game-id' }],
          ['div', { className: 'btn-wrapper' },
            ['button', { type: 'button', className: 'btn font-size', onclick: (event) => joinGame(event) }, 'Enter'],
            ['button', { type: 'button', className: 'btn font-size', onclick: (event) => removePopup(event) }, 'Cancel']
          ]
        ]
      ]
    ];

  const joinHtml = html(joinTemplate);
  const bodyEle = document.querySelector('body');
  bodyEle.appendChild(joinHtml);
};
