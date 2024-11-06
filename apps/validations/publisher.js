const Joi = require("joi");
const objectId = require("joi-objectid")(Joi); // joi-objectid paketini ekleyin

const { VALID_STATUSES } = require("~/config/Enum");

const idValidation = Joi.object({
  id: objectId().required(),
});

const createValidation = Joi.object({
  name: Joi.string().required().min(2),
});

const updateValidation = Joi.object({
  name: Joi.string(),
});
const updateStatusValidation = Joi.object({
  status: Joi.string().valid(...Object.values(VALID_STATUSES)),
});

module.exports = {
  idValidation,
  createValidation,
  updateValidation,
  updateStatusValidation,
};
