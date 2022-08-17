const showMyProfile = () => {
  const myProfileTemplate =
    ['div', { id: 'profile', className: 'profile-wrapper' },
      ['div', { className: 'close' },
        ['div', {
          className: 'close-btn',
          onclick: (event) => closeMyProfile(event)
        }, 'close']
      ]
    ];

  const myProfile = html(myProfileTemplate);
  const expansionEle = getElement('#expansion-window');
  expansionEle.replaceChildren('');
  expansionEle.appendChild(myProfile);
};

const closeMyProfile = (event) => {
  const profileEle = getElement('#profile');
  profileEle.remove();
};
