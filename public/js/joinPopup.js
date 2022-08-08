const removePopup = (event) => {
  const joinPopupEle = document.querySelector('.page-wrapper');
  joinPopupEle.remove();
};

const showInvalidMessage = () => {
  const pageEle = document.querySelector('#page-wrapper');
  const errorMessage = html(['div', { className: 'join-error' }, 'Invalid room id']);
  pageEle.append(errorMessage);
};

const redirectToJoinLobby = () => {
  window.location = '/join-lobby';
};

const joinRoom = (event) => {
  const body = readFormData('#join-popup-form');
  const req = { method: 'post', url: '/join' };
  xhrRequest(req, 200, redirectToJoinLobby, showInvalidMessage, body);
};

const createJoinPopup = (event) => {
  const joinTemplate =
    ['div', { className: 'page-wrapper', id: 'page-wrapper' },
      ['div', { className: 'join-popup-wrapper', id: 'join-popup' },
        [
          'form', { className: 'join-form', id: 'join-popup-form' },
          ['input', { type: 'text', name: 'roomId', placeholder: 'Room id', required: 'true', className: 'room-id' }],
          ['input', { type: 'button', className: 'button', value: 'Enter', onclick: (event) => joinRoom(event) }],
          ['button', { type: 'button', className: 'button', onclick: (event) => removePopup(event) }, 'Cancel']
        ]
      ]
    ];

  const joinHtml = html(joinTemplate);
  const bodyEle = document.querySelector('body');
  bodyEle.appendChild(joinHtml);
};
