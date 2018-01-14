const Activity = require('../models/activity');

function createFlowAggregationPipeline(status) {
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
 * Get the most used flows.
 * A flow to be used needs to start, so it is based on activities that start the flow
 */
function getMostUsedFlows() {
  const mostUsedFlowsAggregationPipeline = createFlowAggregationPipeline('start');
  return Activity.aggregate(mostUsedFlowsAggregationPipeline);
}

/**
 * Get the most completed flows.
 * A flow to be completed needs to end, so it is based on activities that end the flow
 */
function getMostCompletedFlows() {
  const mostCompletedFlowsAggregationPipeline = createFlowAggregationPipeline('end');
  return Activity.aggregate(mostCompletedFlowsAggregationPipeline);
}

module.exports = { getMostCompletedFlows, getMostUsedFlows };
