const api = require('../../config/axios');

const fetchWeet = () =>
  api
    .get('/random')
    .then(({ data }) => data)
    .catch(error => {
      console.error(error);
      return Promise.reject(error);
    });

module.exports = {
  fetchWeet
};
