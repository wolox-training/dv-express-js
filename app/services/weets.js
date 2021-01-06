const api = require('../../config/axios');

const fetchWeet = () =>
  api
    .get('/random')
    .then(({ data }) => data)
    .catch(error => {
      console.error(error);
      Promise.reject(error);
    });

module.exports = {
  fetchWeet
};
