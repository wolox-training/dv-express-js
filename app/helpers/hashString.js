const bcrypt = require('bcrypt');

const config = require('../../config').common.hashing;

const hashString = async string => {
  const hashedString = await bcrypt.hashSync(string, Number(config.salt));
  return hashedString;
};

module.exports = hashString;
