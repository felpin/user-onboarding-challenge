const EntityNotFoundError = require('../errors/entityNotFound');
const Step = require('../models/step');
const flowService = require('../services/flow');

/**
* A step to be saved
* @typedef {Object} NewStep
* @param {string} title The title of the flow
* @param {string} flow The flow of this step
*/

/**
 * Creates a new step
 * @param {NewStep} step The step to be saved
 * @returns {string} The id of the new created step
 */
function create(step) {
  const { title, flow } = step;

  return new Promise((resolve, reject) => {
    flowService
      .exists(flow)
      .then((doesFlowExists) => {
        if (!doesFlowExists) {
          reject(new EntityNotFoundError('flow', flow));
        } else {
          const newStep = new Step({ title, flow });

          newStep.save()
            .then(({ _id }) => {
              resolve(_id);
            })
            .catch((error) => {
              reject(error);
            });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * Check if a step with an id exists
 * @param {string} id The id to check
 * @returns {boolean} If the step exists
 */
function exists(id) {
  return Step
    .findById(id)
    .then(foundStep => !!foundStep);
}

module.exports = { create, exists };
