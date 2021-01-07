const bcrypt = require('bcrypt');

const hashPassword = async password => {
  const hashedPassword = await bcrypt.hashSync(password, Number(process.env.SALT));
  return hashedPassword;
};

module.exports = hashPassword;
