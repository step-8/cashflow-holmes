const toWords = (word) =>
  word.replace(/([A-Z])/g, ' $1').toLowerCase();

module.exports = { toWords };
