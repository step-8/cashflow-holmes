const { createHash } = require('crypto');

const addSalt = text => text + 'cashFLOW';
const getDigest = text => {
  const sha256 = createHash('sha256');
  sha256.update(addSalt(text));
  return sha256.digest('hex');
};
exports.getDigest = getDigest;
