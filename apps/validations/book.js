const Joi = require("joi");

const createValidation = Joi.object({
  name: Joi.string().required().min(2),
  types: Joi.array().required(),
  publisher_name: Joi.string().required(),
  total_page: Joi.string().required(),
});

const updateValidation = Joi.object({
  name: Joi.string().required().min(2),
  types: Joi.array().required(),
  publisher_name: Joi.string().required(),
  total_page: Joi.string().required(),
});

module.exports = {
  createValidation,
  updateValidation,
};
