const Joi = require('joi');

const dateFilterSchema = Joi.object({
  since: Joi.date().iso(),
  until: Joi.date().iso(),
});

module.exports = dateFilterSchema;
