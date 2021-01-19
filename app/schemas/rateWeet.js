const rateWeetSchema = {
  score: {
    in: ['body'],
    exists: true,
    notEmpty: { errorMessage: 'score cannot be empty!' },
    isInt: { errorMessage: 'score must be integer' },
    matches: {
      options: [/^-?[1]+$/],
      errorMessage: 'score must be -1 or 1.'
    }
  },
  id: {
    in: ['params'],
    isInt: { errorMessage: ' must be integer.' },
    toInt: true
  }
};

module.exports = { rateWeetSchema };
