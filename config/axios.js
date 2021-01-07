const axios = require('axios');

const api = axios.create({
  baseURL: process.env.NUMBERS_API_URL,
  timeout: 3000
});

module.exports = api;
