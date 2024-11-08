const APIError = require("~/errors/ApiError");

const handleError = (error, next) => {
  if (error instanceof APIError) {
    return next(error);
  }
  return new APIError(error.message, error.statusCode, __filename);
};

module.exports = handleError;
