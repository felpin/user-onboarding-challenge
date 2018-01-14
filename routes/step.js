const router = require('express').Router();
const Joi = require('joi');
const EntityNotFoundError = require('../errors/entityNotFound');
const idSchema = require('../schemas/id');
const service = require('../services/step');

const creationSchema = Joi.object({
  title: Joi.string().required(),
  flow: idSchema,
});

router.post('/', (req, res) => {
  Joi.validate(req.body, creationSchema)
    .then((step) => {
      service
        .create(step)
        .then((id) => {
          res.location(id);
          res.sendStatus(201);
        })
        .catch((error) => {
          const errorName = error.name;

          if (!errorName) {
            res.sendStatus(500);
            return;
          }

          switch (errorName) {
            case EntityNotFoundError.name:
              res.status(404).send(error);
              break;
            default:
              res.sendStatus(500);
              break;
          }
        });
    })
    .catch(error => res.status(422).json(error));
});

module.exports = router;
