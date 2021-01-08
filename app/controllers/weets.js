const weetsService = require('../services/weets');

const generateWeet = async (_, res, next) => {
  try {
    const weet = await weetsService.fetchWeet();
    res.status(200).send(weet);
  } catch {
    next();
  }
};

module.exports = {
  generateWeet
};
