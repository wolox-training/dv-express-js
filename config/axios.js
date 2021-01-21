const axios = require('axios');
const config = require('./index').common.externalApi;

const api = axios.create({
  baseURL: config.numbers,
  timeout: 3000
});

module.exports = api;
