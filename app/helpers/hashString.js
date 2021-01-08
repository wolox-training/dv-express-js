const bcrypt = require('bcrypt');

const hashString = async password => {
  const hashedString = await bcrypt.hashSync(password, Number(process.env.SALT));
  return hashedString;
};

module.exports = hashString;
