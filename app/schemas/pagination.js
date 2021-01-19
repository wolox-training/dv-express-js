const paginationSchema = {
  page: {
    in: ['query', 'params'],
    isInt: { errorMessage: 'page must be integer.' },
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
