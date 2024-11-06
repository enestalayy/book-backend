const Joi = require("joi");
const objectId = require("joi-objectid")(Joi); // joi-objectid paketini ekleyin

const idValidation = Joi.object({
  id: objectId().required(),
});

const createValidation = Joi.object({
  first_name: Joi.string().required().min(3),
  last_name: Joi.string().required().min(3),
  email: Joi.string().email().required().min(8),
  password: Joi.string().required().min(6),
});

const readValidation = Joi.object({
  book_id: objectId().required(),
  current_page: Joi.string().min(1),
});
const updateValidation = Joi.object({
  first_name: Joi.string().min(3),
  last_name: Joi.string().min(3),
  email: Joi.string().email().min(8),
});

const loginValidation = Joi.object({
  email: Joi.string().email().required().min(8),
  password: Joi.string().required().min(6),
});

const resetPasswordValidation = Joi.object({
  email: Joi.string().email().required().min(8),
});

const changePasswordValidation = Joi.object({
  password: Joi.string().required().min(6),
});

module.exports = {
  idValidation,
  createValidation,
  loginValidation,
  resetPasswordValidation,
  updateValidation,
  changePasswordValidation,
  readValidation,
};
