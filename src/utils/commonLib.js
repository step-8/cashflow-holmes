const toWords = (word) =>
  word.replace(/([A-Z])/g, ' $1').toLowerCase();

const formatAttr = ([attr, value]) => {
  if (value === 'standAlone') {
    return attr;
  }

  const newValue = Array.isArray(value) ? value.join(' ') : value;

  return ' ' + attr + '=' + '"' + newValue + '"';
};

const createAttr = (attributes) => {
  return Object.entries(attributes).map(formatAttr).join('');
};

const closingTag = (tag) => {
  return ['img', 'link', 'meta', 'input'].includes(tag) ? '' : '</' + tag + '>';
};

const html = function ([tag, attr, ...content]) {
  const mainContent = content.map(element => {
    return Array.isArray(element) ? html(element) : element;
  }).join('');

  return '<' + tag + createAttr(attr) + '>' + mainContent + closingTag(tag);
};

const capitalize = (word) => {
  const [first, ...rest] = word + '';
  return first.toUpperCase().concat(rest.join(''));
};

const generateRatTile = (type, id) => {
  const template = [
    'div', { class: ['ratrace-tile', 'flex-row', type], id: `rat-tile-${id}` },
    ['div', { class: ['tile-info', 'flex-column'] },
      ['img', { src: `images/ratrace/${type}.png`, alt: type }],
      ['div', { class: 'tile-name' }, capitalize(type)]
    ]];
  return html(template);
};

const generateRatTiles = () => {
  const tiles = ['deal', 'doodad', 'deal', 'charity', 'deal', 'payday', 'deal',
    'market', 'deal', 'doodad', 'deal', 'downsized', 'deal', 'payday', 'deal',
    'market', 'deal', 'doodad', 'deal', 'baby', 'deal', 'payday', 'deal', 'market'];

  return tiles.map((type, index) => generateRatTile(type, index + 1)).join('');
};

module.exports = { toWords, generateRatTiles, generateRatTile, capitalize };
