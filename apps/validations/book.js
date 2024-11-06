const Joi = require("joi");
const objectId = require("joi-objectid")(Joi); // joi-objectid paketini ekleyin

const { VALID_STATUSES } = require("~/config/Enum");

const idValidation = Joi.object({
  id: objectId().required(),
});
const createValidation = Joi.object({
  name: Joi.string().required().min(2),
  types: Joi.array().required(),
  publisher: Joi.object({
    publisher_id: objectId().required(),
    publisher_name: Joi.string().required(),
  }),
  total_page: Joi.string().required(),
});

const updateValidationByAuthor = Joi.object({
  name: Joi.string().min(2).max(30),
  types: Joi.array(),
  publisher: Joi.object({
    publisher_id: objectId().required(),
    publisher_name: Joi.string().required(),
  }),
  total_page: Joi.string(),
});

const updateValidationByPublisher = Joi.object({
  status: Joi.string().valid(...Object.values(VALID_STATUSES)),
});

module.exports = {
  idValidation,
  createValidation,
  updateValidationByPublisher,
  updateValidationByAuthor,
};
