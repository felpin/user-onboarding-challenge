const router = require('express').Router();
const Joi = require('joi');
const EntityNotFoundError = require('../errors/entityNotFound');
const service = require('../services/flow');

router.get('/', (req, res) => {
  service
    .getAll()
    .then(flows => res.status(200).json(flows))
    .catch(() => res.sendStatus(500));
});

router.get('/:id', (req, res) => {
  const OBJECT_ID_LENGTH = 24;
  const idSchema = Joi.string().hex().length(OBJECT_ID_LENGTH).required();

  Joi
    .validate(req.params.id, idSchema)
    .then((id) => {
      service
        .get(id)
        .then(flow => res.status(200).json(flow))
        .catch((error) => {
          if (error && error.name === EntityNotFoundError.name) {
            res.status(404).json(error);
          } else {
            res.sendStatus(500);
          }
        });
    })
    .catch(error => res.status(422).json(error));
});

module.exports = router;
