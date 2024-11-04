const Joi = require("joi");
const { VALID_STATUSES } = require("~/config/Enum");

const createValidation = Joi.object({
  name: Joi.string().required().min(2),
});

const updateValidation = Joi.object({
  name: Joi.string(),
  status: Joi.string().valid(...Object.values(VALID_STATUSES)),
});

module.exports = {
  createValidation,
  updateValidation,
};
