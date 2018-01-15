const { ObjectId } = require('mongoose').Types;
const Flow = require('../models/flow');
const EntityNotFoundError = require('../errors/entityNotFound');

/**
* A step of a flow
* @typedef {Object} Step
* @param {string} id The id of the step
* @param {string} title The title of the step
*/

/**
* A step database model
* @typedef {Object} StepModel
* @param {string} _id The id of the step
* @param {string} title The title of the step
*/

/**
 * A flow
 * @typedef {Object} Flow
 * @param {string} id The id of the flow
 * @param {string} title The title of the flow
 * @param {Step[]} steps The steps of this flow
 */

/**
* A flow to be saved
* @typedef {Object} NewFlow
* @param {string} title The title of the flow
*/

/**
* A flow database model
* @typedef {Object} FlowModel
* @param {string} _id The id of the flow
* @param {string} title The title of the flow
* @param {StepModel[]} steps The steps of this model
*/

const lookupSteps = {
  $lookup: {
    from: 'steps',
    localField: '_id',
    foreignField: 'flow',
    as: 'steps',
  },
};

/**
 * Creates a new flow
 * @param {NewFlow} flow The flow to be saved
 * @returns {string} The id of the new created flow
 */
function create(flow) {
  const newFlow = new Flow({
    title: flow.title,
  });

  return newFlow
    .save()
    .then(({ _id }) => _id);
}

/**
 * Check if a flow with an id exists
 * @param {string} id The id to check
 * @returns {boolean} If the flow exists
 */
function exists(id) {
  return Flow
    .findById(id)
    .then(foundFlow => !!foundFlow);
}

/**
 * Get a flow by id
 * @param {string} id The id of the flow
 * @returns {Promise<Flow>} The flow object
 */
function get(id) {
  return Flow
    .aggregate([{ $match: { _id: ObjectId(id) } }, lookupSteps])
    .then((flows) => {
      if (!flows.length) {
        throw new EntityNotFoundError('flow', id);
      }

      const flow = flows[0];
      return transform(flow);
    });
}

/**
 * Get all the flows
 * @returns {Promise<Flow[]>} The existing flows
 */
function getAll() {
  return Flow
    .aggregate([lookupSteps])
    .then(flows => flows.map(flow => transform(flow)));
}

/**
 * Rename recursively the properties _id to id
 * @param {FlowModel} flowModel The object with _id property
 * @returns {Flow} The object with id property
 */
function transform(flowModel) {
  const { _id: id, title, steps } = flowModel;

  const stepsCopy = steps.map(step => ({ id: step._id, title: step.title }));

  const flowCopy = { id, title, steps: stepsCopy };

  return flowCopy;
}

module.exports = {
  create,
  exists,
  get,
  getAll,
};
