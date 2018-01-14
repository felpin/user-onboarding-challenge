const Activity = require('../models/activity');

const sortFlowsByCancelCountAggregationPipeline = createFlowSortByStatusCountAggregationPipeline('cancel');
const sortFlowsByEndCountAggregationpipeline = createFlowSortByStatusCountAggregationPipeline('end');
const sortFlowsByStartCountAggregationPipeline = createFlowSortByStatusCountAggregationPipeline('start');

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

module.exports = { sortFlowsByCancelCount, sortFlowsByEndCount, sortFlowsByStartCount };
