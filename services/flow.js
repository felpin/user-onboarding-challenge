const Flow = require('../models/flow');

/**
 * A flow
 * @typedef {Object} Flow
 * @param {string} id The id of the flow
 * @param {string} title The title of the flow
 */

/**
* A flow database model
* @typedef {Object} FlowModel
* @param {string} _id The id of the flow
* @param {string} title The title of the flow
*/

/**
 * Get all the flows
 * @returns {Promise<Flow[]>} The existing flows
 */
function getAll() {
  return Flow
    .find()
    .then(flows => flows.map(flow => renameId(flow)));
}

/**
 * Rename the property _id in flowModel to id
 * @param {FlowModel} flowModel The object with _id property
 * @returns {Flow} The object with id property
 */
function renameId(flowModel) {
  const { _id: id, title } = flowModel;

  const flowCopy = { id, title };

  return flowCopy;
}

module.exports = {
  getAll,
};
