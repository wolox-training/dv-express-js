const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.SCHEMA_VALIDATION_ERROR = 'schema_validation_error';
exports.schemaValidationError = message => internalError(message, exports.SCHEMA_VALIDATION_ERROR);

exports.REGISTERED_EMAIL_ERROR = 'registered_email_error';
exports.registeredEmailError = message => internalError(message, exports.REGISTERED_EMAIL_ERROR);
