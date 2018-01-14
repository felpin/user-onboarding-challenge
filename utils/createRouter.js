const createExpressRouter = require('express').Router;
const Joi = require('joi');
const idSchema = require('../schemas/id');
const EntityNotFoundError = require('../errors/entityNotFound');

/**
 * A service with get and getAll functions
 * @typedef {Object} Service
 * @param {function} get Get a single entity
 * @param {function} getAll Get all entities
 */

/**
 * Creates a route with get all entities and get a single entity enpoints
 * @param {Service} service The service to use
 * @returns {Router} The express' router created
 */
function createRouter(service) {
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

  return router;
}

module.exports = createRouter;
