const fs = require('fs');

const readCredentials = (config) => {
  config.credentials = JSON.parse(fs.readFileSync(config.CRED_PATH, 'utf8'));
};

module.exports = { readCredentials };
