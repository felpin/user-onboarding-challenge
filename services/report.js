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
 * Sort flows by the number of activities that cancel it.
 * But, for every canceled activity, there must be another to start it.
 */
function sortFlowsByCancelCountAlternative() {
  const aggregationByCancel = Activity.aggregate(sortFlowsByCancelCountAggregationPipeline);
  return useMinimiumCountSortingFlows(aggregationByCancel);
}

/**
 * Sort flows by the number of activities that end it.
 */
function sortFlowsByEndCount() {
  return Activity.aggregate(sortFlowsByEndCountAggregationpipeline);
}

/**
 * Sort flows by the number of activities that end it.
 * But, for every ended activity, there must be another to start it.
 */
function sortFlowsByEndCountAlternative() {
  const aggregationByEnd = Activity.aggregate(sortFlowsByEndCountAggregationpipeline);
  return useMinimiumCountSortingFlows(aggregationByEnd);
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
 * Sort steps in a flow by the number of activities that cancel it.
 * But, for every canceled activity, there must be another to start it.
 * @param {string} flowId The id of the flow containing the steps
 */
function sortStepsByCancelCountAlternative(flowId) {
  const aggregationCount = Step.aggregate(sortStepsByCancelCountAggregationPipeline(flowId));
  return useMinimiumCountSortingSteps(flowId, aggregationCount);
}

/**
 * Sort steps in a flow by the number of activities that end it.
 * @param {string} flowId The id of the flow containing the steps
 */
function sortStepsByEndCount(flowId) {
  return Step.aggregate(sortStepsByEndCountAggregationPipeline(flowId));
}

/**
 * Sort steps in a flow by the number of activities that end it.
 * But, for every ended activity, there must be another to start it.
 * @param {string} flowId The id of the flow containing the steps
 */
function sortStepsByEndCountAlternative(flowId) {
  const aggregationCount = Step.aggregate(sortStepsByEndCountAggregationPipeline(flowId));
  return useMinimiumCountSortingSteps(flowId, aggregationCount);
}

/**
 * Sort steps in a flow by the number of activities that start it.
 * @param {string} flowId The id of the flow containing the steps
 */
function sortStepsByStartCount(flowId) {
  return Step.aggregate(sortStepsByStartCountAggregationPipeline(flowId));
}

function useMinimiumCountSortingFlows(aggregationPromise) {
  const flowsSortedByStartCountPromise =
    Activity.aggregate(sortFlowsByStartCountAggregationPipeline);

  return Promise
    .all([flowsSortedByStartCountPromise, aggregationPromise])
    .then(([flowsSortedByStartCount, aggregationCount]) => {
      const flowsSortedByStartCountMap =
        new Map(flowsSortedByStartCount.map(flowAggregation =>
          ([flowAggregation.flow.id.toString(), flowAggregation.count])));

      return aggregationCount
        .map((flowAggregation) => {
          const { flow, count } = flowAggregation;
          const { id } = flow;

          return {
            count: Math.min(count, flowsSortedByStartCountMap.get(id.toString())),
            flow,
          };
        })
        .sort((a, b) => b.count - a.count);
    });
}

function useMinimiumCountSortingSteps(flowId, aggregationPromise) {
  const stepsSortedByStartCountPromise =
    Step.aggregate(sortStepsByStartCountAggregationPipeline(flowId));

  return Promise
    .all([stepsSortedByStartCountPromise, aggregationPromise])
    .then(([stepsSortedByStartCount, aggregationCount]) => {
      const stepsSortedByStartCountMap =
        new Map(stepsSortedByStartCount.map(stepAggregation =>
          ([stepAggregation.step.id.toString(), stepAggregation.count])));

      return aggregationCount
        .map((stepAggregation) => {
          const { step, count } = stepAggregation;
          const { id } = step;

          return {
            count: Math.min(count, stepsSortedByStartCountMap.get(id.toString())),
            step,
          };
        })
        .sort((a, b) => b.count - a.count);
    });
}

module.exports = {
  sortFlowsByCancelCount,
  sortFlowsByCancelCountAlternative,
  sortFlowsByEndCount,
  sortFlowsByEndCountAlternative,
  sortFlowsByStartCount,
  sortStepsByCancelCount,
  sortStepsByCancelCountAlternative,
  sortStepsByEndCount,
  sortStepsByEndCountAlternative,
  sortStepsByStartCount,
};
