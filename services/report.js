const { ObjectId } = require('mongoose').Types;
const Activity = require('../models/activity');
const Step = require('../models/step');

const sortFlowsByCancelCountAggregationPipeline = createFlowSortByStatusCountAggregationPipeline('cancel');
const sortFlowsByEndCountAggregationpipeline = createFlowSortByStatusCountAggregationPipeline('end');
const sortFlowsByStartCountAggregationPipeline = createFlowSortByStatusCountAggregationPipeline('start');
const sortStepsByCancelCountAggregationPipeline = flowId => createStepSortByStatusCountAggregationPipeline(flowId, 'cancel');
const sortStepsByEndCountAggregationPipeline = flowId => createStepSortByStatusCountAggregationPipeline(flowId, 'end');
const sortStepsByStartCountAggregationPipeline = flowId => createStepSortByStatusCountAggregationPipeline(flowId, 'start');

function createFlowSortByStatusCountAggregationPipeline(status) {
  return [
    { $match: { type: 'flow', status } },
    { $sortByCount: '$flow' },
    {
      $lookup: {
        from: 'flows',
        localField: '_id',
        foreignField: '_id',
        as: 'flows',
      },
    },
    { $project: { _id: 0, flow: { $arrayElemAt: ['$flows', 0] }, count: 1 } },
    { $project: { flow: { id: '$flow._id', title: 1 }, count: 1 } },
  ];
}

function createStepSortByStatusCountAggregationPipeline(flowId, status) {
  return [
    { $match: { flow: ObjectId(flowId) } },
    {
      $lookup: {
        from: 'activities',
        localField: '_id',
        foreignField: 'step',
        as: 'activities',
      },
    },
    {
      $project: {
        _id: 0,
        step: { id: '$_id', title: '$title' },
        activities: {
          $filter: {
            input: '$activities',
            as: 'activity',
            cond: { $eq: ['$$activity.status', status] },
          },
        },
      },
    },
    { $project: { step: 1, count: { $size: '$activities' } } },
    { $sort: { count: -1 } },
  ];
}

/**
 * Sort flows by the number of activities that cancel it.
 */
function sortFlowsByCancelCount() {
  return Activity.aggregate(sortFlowsByCancelCountAggregationPipeline);
}

/**
 * Sort flows by the number of activities that end it.
 */
function sortFlowsByEndCount() {
  return Activity.aggregate(sortFlowsByEndCountAggregationpipeline);
}

/**
 * Sort flows by the number of activities that start it.
 */
function sortFlowsByStartCount() {
  return Activity.aggregate(sortFlowsByStartCountAggregationPipeline);
}

/**
 * Sort steps in a flow by the number of activities that cancel it.
 * @param {string} flowId The id of the flow containing the steps
 */
function sortStepsByCancelCount(flowId) {
  return Step.aggregate(sortStepsByCancelCountAggregationPipeline(flowId));
}

/**
 * Sort steps in a flow by the number of activities that end it.
 * @param {string} flowId The id of the flow containing the steps
 */
function sortStepsByEndCount(flowId) {
  return Step.aggregate(sortStepsByEndCountAggregationPipeline(flowId));
}

/**
 * Sort steps in a flow by the number of activities that start it.
 * @param {string} flowId The id of the flow containing the steps
 */
function sortStepsByStartCount(flowId) {
  return Step.aggregate(sortStepsByStartCountAggregationPipeline(flowId));
}

module.exports = {
  sortFlowsByCancelCount,
  sortFlowsByEndCount,
  sortFlowsByStartCount,
  sortStepsByCancelCount,
  sortStepsByEndCount,
  sortStepsByStartCount,
};
