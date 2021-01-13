const weetsService = require('../services/weets');

const generateWeet = async (_, res, next) => {
  try {
    const weet = await weetsService.fetchWeet();
    return res.status(200).send(weet);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  generateWeet
};
