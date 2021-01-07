const service = require('../services/weets');

const generateWeet = async (_, res) => {
  try {
    const weet = await service.fetchWeet();
    res.status(200).send(weet);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

module.exports = {
  generateWeet
};
