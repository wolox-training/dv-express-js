const bcrypt = require('bcrypt');

const hashString = async string => {
  const hashedString = await bcrypt.hashSync(string, Number(process.env.SALT));
  return hashedString;
};

module.exports = hashString;
