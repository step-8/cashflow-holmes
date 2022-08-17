const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const toWords = (inputString) => {
  const notNullString = inputString || '';
  const trimmedString = notNullString.trim();
  const arrayOfStrings = trimmedString.split(' ');

  const splitStringsArray = [];
  arrayOfStrings.forEach(tempString => {
    if (tempString != '') {
      const splitWords = tempString.split(/(?=[A-Z])/).join(' ');
      splitStringsArray.push(capitalizeFirstLetter(splitWords));
    }
  });

  return splitStringsArray.join(' ').toLowerCase();
};

module.exports = { toWords };
