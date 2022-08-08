const removePopup = (event) => {
  const joinPopupEle = document.querySelector('.page-wrapper');
  joinPopupEle.remove();
};

const createJoinPopup = (event) => {
  const joinTemplate =
    ['div', { className: 'page-wrapper' },
      ['div', { className: 'join-popup-wrapper', id: 'join-popup' },
        [
          'form', { method: 'post', action: '/join', className: 'join-form' },
          ['input', { type: 'number', placeholder: 'Room id', required: 'true', className: 'room-id' }],
          ['input', { type: 'submit', className: 'button', value: 'Enter' }],
          ['button', { type: 'button', className: 'button', onclick: (event) => removePopup(event) }, 'Cancel']
        ]
      ]
    ];

  const joinHtml = html(joinTemplate);
  const bodyEle = document.querySelector('body');
  bodyEle.appendChild(joinHtml);
};
