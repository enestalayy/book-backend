const { default: httpStatus } = require("http-status");

const validateParams = (schema) => (req, res, next) => {
  const { value, error } = schema.validate(req.params);
  if (error) {
    const errorMessage = error.details
      ?.map((detail) => detail.message)
      .join(", ");

    res.status(httpStatus.BAD_REQUEST).json({ error: errorMessage });
    return;
  }

  Object.assign(req, value);
  return next();
};

module.exports = validateParams;
