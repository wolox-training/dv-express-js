const rateWeetSchema = {
  score: {
    exists: true,
    notEmpty: { errorMessage: 'score cannot be empty!' },
    isInt: { errorMessage: 'score must be integer' },
    matches: {
      options: [/^-?[1]+$/],
      errorMessage: 'score must be -1 or 1.'
    }
  }
};

module.exports = { rateWeetSchema };
