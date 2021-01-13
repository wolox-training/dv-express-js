const api = require('../../config/axios');
const errors = require('../errors');

const fetchWeet = () =>
  api
    .get('/random')
    .then(({ data }) => data)
    .catch(() => Promise.reject(errors.databaseError('Could not connect with external api')));

module.exports = {
  fetchWeet
};
