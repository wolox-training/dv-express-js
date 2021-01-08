const { checkSchema, validationResult } = require('express-validator');
const errors = require('../errors');

const verifySchema = schema => checkSchema(schema);

const validateResult = (req, _, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    throw errors.schemaValiation(err.mapped());
  }
  return next();
};

const validateBySchema = schema => [verifySchema(schema), validateResult];

module.exports = validateBySchema;
