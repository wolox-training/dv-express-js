const weetsService = require('../services/weets');

const generateWeet = async (req, res, next) => {
  try {
    const weet = await weetsService.fetchWeet();
    const postWeet = await weetsService.createWeet(req.user, weet);
    return res.status(201).send(postWeet);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  generateWeet
};
