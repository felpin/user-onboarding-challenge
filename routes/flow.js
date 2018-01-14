const Joi = require('joi');
const service = require('../services/flow');
const createRouter = require('../utils/createRouter');

const router = createRouter(service);

const creationSchema = Joi.object({
  title: Joi.string().required(),
});

router.post('/', (req, res) => {
  Joi.validate(req.body, creationSchema)
    .then((flow) => {
      service
        .create(flow)
        .then((id) => {
          res.location(id);
          res.sendStatus(201);
        })
        .catch(() => {
          res.sendStatus(500);
        });
    })
    .catch(error => res.status(422).json(error));
});

module.exports = router;
