const api = require('../../config/axios');

const fetchWeet = () => api.get('/random');

module.exports = {
  fetchWeet
};
