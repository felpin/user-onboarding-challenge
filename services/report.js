const Activity = require('../models/activity');

const mostUsedFlowsAggregationPipeline = [
  { $match: { type: 'flow', status: 'start' } },
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

function getMostUsedFlows() {
  return Activity.aggregate(mostUsedFlowsAggregationPipeline);
}

module.exports = { getMostUsedFlows };
