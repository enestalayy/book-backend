const Joi = require("joi");
const objectId = require("joi-objectid")(Joi);

const idValidation = Joi.object({
  id: objectId().required(),
});

const createValidation = Joi.object({
  book_id: objectId().required(),
  comment: Joi.string().required().min(3).max(200),
  rating: Joi.string().required().max(1),
});

const updateValidation = Joi.object({
  comment: Joi.string().min(3).max(200),
  rating: Joi.string().max(1),
});

module.exports = {
  idValidation,
  createValidation,
  updateValidation,
};
