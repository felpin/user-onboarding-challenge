const Joi = require('joi');
const service = require('../services/user');
const createRouter = require('../utils/createRouter');

const creationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  alias: Joi.string().required(),
});

const router = createRouter(service, creationSchema);

module.exports = router;
