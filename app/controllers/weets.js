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

const getWeets = async (req, res, next) => {
  try {
    const weets = await weetsService.readWeets(req.query);
    return res.status(200).send(weets);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  generateWeet,
  getWeets
};
