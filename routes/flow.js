const Joi = require('joi');
const service = require('../services/flow');
const createRouter = require('../utils/createRouter');

const creationSchema = Joi.object({
  title: Joi.string().required(),
});

const router = createRouter(service, creationSchema);

module.exports = router;
