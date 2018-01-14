const createExpressRouter = require('express').Router;
const Joi = require('joi');
const idSchema = require('../schemas/id');
const EntityNotFoundError = require('../errors/entityNotFound');

/**
 * A service with create, get and getAll functions
 * @typedef {Object} Service
 * @param {function} get Get a single entity
 * @param {function} getAll Get all entities
 * @param {function} create Create a new entity
 */

/**
 * Creates a route with get all entities, get a single entity and create a entity enpoints
 * @param {Service} service The service to use
 * @param {Schema} creationSchema A Joi schema to validate new entities
 * @returns {Router} The express' router created
 */
function createRouter(service, creationSchema) {
  const router = createExpressRouter();

  router.get('/', (req, res) => {
    service
      .getAll()
      .then(flows => res.status(200).json(flows))
      .catch(() => res.sendStatus(500));
  });

  router.get('/:id', (req, res) => {
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

  router.post('/', (req, res) => {
    Joi.validate(req.body, creationSchema)
      .then((entity) => {
        service
          .create(entity)
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

  return router;
}

module.exports = createRouter;
