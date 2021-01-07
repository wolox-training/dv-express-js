const { checkSchema, validationResult } = require('express-validator');

const verifySchema = schema => checkSchema(schema);

const validateResult = (req, res, next) => {
  const err = validationResult(req);
  if (err.isEmpty()) {
    next();
  } else {
    res.status(409).send(err.mapped());
  }
};

const validateBySchema = schema => [verifySchema(schema), validateResult];

module.exports = validateBySchema;
