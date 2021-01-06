const api = require('../../config/axios');

const fetchWeet = () =>
  api
    .get('/random')
    .then(({ data }) => data)
    .catch(error => error);

module.exports = {
  fetchWeet
};
