const router = require('express').Router();
const Joi = require('joi');
const dateFilterSchema = require('../schemas/dateFilter');
const idSchema = require('../schemas/id');
const service = require('../services/userReport');

function configureRouter(req, res, getUsersFunction) {
  const validateId = Joi.validate(req.params.id, idSchema);
  const validateQuery = Joi.validate(req.query, dateFilterSchema);

  Promise
    .all([validateId, validateQuery])
    .then(([id, query]) => {
      getUsersFunction(id, query)
        .then((users) => {
          res.status(200).json(users);
        })
        .catch(() => {
          res.sendStatus(500);
        });
    })
    .catch(error => res.status(422).json(error));
}

router.get('/users-started-flow/:id', (req, res) => {
  configureRouter(req, res, service.getUsersWhoStartedFlow);
});

router.get('/users-completed-flow/:id', (req, res) => {
  configureRouter(req, res, service.getUsersWhoEndedFlow);
});

router.get('/users-canceled-flow/:id', (req, res) => {
  configureRouter(req, res, service.getUsersWhoCanceledFlow);
});

router.get('/users-started-step/:id', (req, res) => {
  configureRouter(req, res, service.getUsersWhoStartedStep);
});

router.get('/users-completed-step/:id', (req, res) => {
  configureRouter(req, res, service.getUsersWhoEndedStep);
});

router.get('/users-canceled-step/:id', (req, res) => {
  configureRouter(req, res, service.getUsersWhoCanceledStep);
});

module.exports = router;
