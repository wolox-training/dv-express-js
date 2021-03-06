const paginationSchema = {
  page: {
    in: ['query', 'params'],
    isInt: { options: { min: 1 }, errorMessage: 'Page must be an integer greater than zero.' },
    toInt: true,
    optional: { options: { nullable: true } }
  },
  limit: {
    in: ['query', 'params'],
    isInt: { errorMessage: 'limit must be integer.' },
    toInt: true,
    optional: { options: { nullable: true } }
  }
};

module.exports = paginationSchema;
