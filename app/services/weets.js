const api = require('../../config/axios');

const fetchWeet = () =>
  api
    .get('/random')
    .then(({ data }) => data)
    .catch(error => {
      console.error(error);
      return error;
    });

module.exports = {
  fetchWeet
};
