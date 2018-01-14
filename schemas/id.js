const Joi = require('joi');

const OBJECT_ID_LENGTH = 24;
const idSchema = Joi.string().hex().length(OBJECT_ID_LENGTH).required();

module.exports = idSchema;
