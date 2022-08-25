const resetForm = (selector) => {
  const form = document.querySelector(selector);
  form.reset();
};

const readFormData = (selector) => {
  const form = document.querySelector(selector);
  const formData = new FormData(form);
  const body = new URLSearchParams(formData);
  return body;
};

const setAttribute = (tagEle, attributes) => {
  Object.entries(attributes).forEach(([key, value]) => {
    if (!value) {
      tagEle[key] = key;
      return;
    }
    tagEle[key] = value;
  });
};

const html = ([tag, attributes, ...content]) => {
  const tagEle = document.createElement(tag);

  setAttribute(tagEle, attributes);

  const newEle = content.map(ele => Array.isArray(ele) ? html(ele) : ele);
  newEle.forEach(ele => tagEle.append(ele));

  return tagEle;
};

const reqPage = (action) => {
  const form = document.createElement('form');
  getElement('body').append(form);

  form.action = action;
  form.style.visibility = 'hidden';
  form.submit();
};

const getElement = (selector) => {
  return document.querySelector(selector);
};

const addDollar = (number) => {
  if (number < 0) {
    return `-$${Math.abs(number)}`;
  }

  return `$${number}`;
};

const drawForCurrentUser = (fn) => (game) => {
  const { username } = game;
  if (game.currentPlayer.username === username) {
    fn(game);
  }
};

const camelToCapitalize = (word) => {
  const spacedWord = ('' + word).replace(/([A-Z])/g, ' $1').toLowerCase();
  const [first, ...rest] = spacedWord;
  return first.toUpperCase().concat(rest.join(''));
};

const isEnter = (event) => event.key === 'Enter';