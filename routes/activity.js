const router = require('express').Router();
const Joi = require('joi');
const EntityNotFoundError = require('../errors/entityNotFound');
const idSchema = require('../schemas/id');
const service = require('../services/activity');

const creationSchema = Joi.object({
  ref: idSchema,
  user: idSchema,
});

function createActivity(req, res, { status, type }) {
  Joi.validate(req.body, creationSchema)
    .then((body) => {
      const { ref, user } = body;

      service
        .create({
          ref,
          user,
          status,
          type,
        })
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
}

router.post('/flow-start', (req, res) => {
  createActivity(req, res, { type: 'flow', status: 'start' });
});

router.post('/flow-end', (req, res) => {
  createActivity(req, res, { type: 'flow', status: 'end' });
});

router.post('/flow-cancel', (req, res) => {
  createActivity(req, res, { type: 'flow', status: 'cancel' });
});

router.post('/step-start', (req, res) => {
  createActivity(req, res, { type: 'step', status: 'start' });
});

router.post('/step-end', (req, res) => {
  createActivity(req, res, { type: 'step', status: 'end' });
});

router.post('/step-cancel', (req, res) => {
  createActivity(req, res, { type: 'step', status: 'cancel' });
});

module.exports = router;
