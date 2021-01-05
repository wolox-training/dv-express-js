const service = require('../services/weets');

const generateWeet = async (_, res) => {
  try {
    const { data } = await service.fetchWeet();
    res.status(200).send(data);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

module.exports = {
  generateWeet
};
