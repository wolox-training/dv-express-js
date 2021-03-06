const errors = require('../errors');
const logger = require('../logger');

const DEFAULT_STATUS_CODE = 500;

const statusCodes = {
  [errors.DATABASE_ERROR]: 503,
  [errors.DEFAULT_ERROR]: 500,
  [errors.WRONG_CREDENTIALS_ERROR]: 401,
  [errors.UNAUTHENTICATED_ERROR]: 401,
  [errors.SCHEMA_VALIDATION_ERROR]: 422,
  [errors.REGISTERED_EMAIL_ERROR]: 409,
  [errors.FORBIDEN_MODULE_ERROR]: 403,
  [errors.BAD_REQUEST_ERROR]: 400,
  [errors.NOT_FOUND_ERROR]: 404,
  [errors.WITHOUT_CONNECTION_ERROR]: 503,
  [errors.INVALID_WEET_ERROR]: 422,
  [errors.INVALID_ACCESS_TOKEN_ERROR]: 401
};

exports.handle = (error, req, res, next) => {
  if (error.internalCode) res.status(statusCodes[error.internalCode] || DEFAULT_STATUS_CODE);
  else {
    // Unrecognized error, notifying it to rollbar.
    next(error);
    res.status(DEFAULT_STATUS_CODE);
  }
  logger.error(error);
  return res.send({ message: error.message, internal_code: error.internalCode });
};
