const { ObjectId } = require('mongoose').Types;
const Activity = require('../models/activity');
const Step = require('../models/step');

const sortFlowsByCancelCountAggregationPipeline = filter => createFlowSortByStatusCountAggregationPipeline('cancel', filter);
const sortFlowsByEndCountAggregationpipeline = filter => createFlowSortByStatusCountAggregationPipeline('end', filter);
const sortFlowsByStartCountAggregationPipeline = filter => createFlowSortByStatusCountAggregationPipeline('start', filter);

const sortStepsByCancelCountAggregationPipeline = (flowId, filter) => createStepSortByStatusCountAggregationPipeline(flowId, 'cancel', filter);
const sortStepsByEndCountAggregationPipeline = (flowId, filter) => createStepSortByStatusCountAggregationPipeline(flowId, 'end', filter);
const sortStepsByStartCountAggregationPipeline = (flowId, filter) => createStepSortByStatusCountAggregationPipeline(flowId, 'start', filter);

function createFlowSortByStatusCountAggregationPipeline(status, filter) {
  const aggregationMatch = { type: 'flow', status };

  if (filter) {
    aggregationMatch.occured = {};

    if (filter.since) {
      aggregationMatch.occured.$gte = filter.since;
    }

    if (filter.until) {
      aggregationMatch.occured.$lt = filter.until;
    }
  }

  return [
    { $match: aggregationMatch },
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

function createStepSortByStatusCountAggregationPipeline(flowId, status, filter) {
  const andCondition = [{ $eq: ['$$activity.status', status] }];

  if (filter && filter.since) {
    andCondition.push({ $gte: ['$$activity.occured', filter.since] });
  }

  if (filter && filter.until) {
    andCondition.push({ $lt: ['$$activity.occured', filter.until] });
  }

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
            cond: { $and: andCondition },
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
 * @param {Object} filter The filter, if has any
 * @param {Date} [filter.since] A date to filter as start date
 * @param {Date} [filter.until] A date to filter as end date
 */
function sortFlowsByCancelCount(filter) {
  return Activity.aggregate(sortFlowsByCancelCountAggregationPipeline(filter));
}

/**
 * Sort flows by the number of activities that cancel it.
 * But, for every canceled activity, there must be another to start it.
 * @param {Object} filter The filter, if has any
 * @param {Date} [filter.since] A date to filter as start date
 * @param {Date} [filter.until] A date to filter as end date
 */
function sortFlowsByCancelCountAlternative(filter) {
  const aggregationByCancel = Activity.aggregate(sortFlowsByCancelCountAggregationPipeline(filter));
  return useMinimiumCountSortingFlows(aggregationByCancel, filter);
}

/**
 * Sort flows by the number of activities that end it.
 * @param {Object} filter The filter, if has any
 * @param {Date} [filter.since] A date to filter as start date
 * @param {Date} [filter.until] A date to filter as end date
 */
function sortFlowsByEndCount(filter) {
  return Activity.aggregate(sortFlowsByEndCountAggregationpipeline(filter));
}

/**
 * Sort flows by the number of activities that end it.
 * But, for every ended activity, there must be another to start it.
 * @param {Object} filter The filter, if has any
 * @param {Date} [filter.since] A date to filter as start date
 * @param {Date} [filter.until] A date to filter as end date
 */
function sortFlowsByEndCountAlternative(filter) {
  const aggregationByEnd = Activity.aggregate(sortFlowsByEndCountAggregationpipeline(filter));
  return useMinimiumCountSortingFlows(aggregationByEnd, filter);
}

/**
 * Sort flows by the number of activities that start it.
 * @param {Object} filter The filter, if has any
 * @param {Date} [filter.since] A date to filter as start date
 * @param {Date} [filter.until] A date to filter as end date
 */
function sortFlowsByStartCount(filter) {
  return Activity.aggregate(sortFlowsByStartCountAggregationPipeline(filter));
}

/**
 * Sort steps in a flow by the number of activities that cancel it.
 * @param {string} flowId The id of the flow containing the steps
 * @param {Object} filter The filter, if has any
 * @param {Date} [filter.since] A date to filter as start date
 * @param {Date} [filter.until] A date to filter as end date
 */
function sortStepsByCancelCount(flowId, filter) {
  return Step.aggregate(sortStepsByCancelCountAggregationPipeline(flowId, filter));
}

/**
 * Sort steps in a flow by the number of activities that cancel it.
 * But, for every canceled activity, there must be another to start it.
 * @param {string} flowId The id of the flow containing the steps
 * @param {Object} filter The filter, if has any
 * @param {Date} [filter.since] A date to filter as start date
 * @param {Date} [filter.until] A date to filter as end date
 */
function sortStepsByCancelCountAlternative(flowId, filter) {
  const aggregationCount =
    Step.aggregate(sortStepsByCancelCountAggregationPipeline(flowId, filter));
  return useMinimiumCountSortingSteps(flowId, aggregationCount, filter);
}

/**
 * Sort steps in a flow by the number of activities that end it.
 * @param {string} flowId The id of the flow containing the steps
 * @param {Object} filter The filter, if has any
 * @param {Date} [filter.since] A date to filter as start date
 * @param {Date} [filter.until] A date to filter as end date
 */
function sortStepsByEndCount(flowId, filter) {
  return Step.aggregate(sortStepsByEndCountAggregationPipeline(flowId, filter));
}

/**
 * Sort steps in a flow by the number of activities that end it.
 * But, for every ended activity, there must be another to start it.
 * @param {string} flowId The id of the flow containing the steps
 * @param {Object} filter The filter, if has any
 * @param {Date} [filter.since] A date to filter as start date
 * @param {Date} [filter.until] A date to filter as end date
 */
function sortStepsByEndCountAlternative(flowId, filter) {
  const aggregationCount = Step.aggregate(sortStepsByEndCountAggregationPipeline(flowId, filter));
  return useMinimiumCountSortingSteps(flowId, aggregationCount, filter);
}

/**
 * Sort steps in a flow by the number of activities that start it.
 * @param {string} flowId The id of the flow containing the steps
 * @param {Object} filter The filter, if has any
 * @param {Date} [filter.since] A date to filter as start date
 * @param {Date} [filter.until] A date to filter as end date
 */
function sortStepsByStartCount(flowId, filter) {
  return Step.aggregate(sortStepsByStartCountAggregationPipeline(flowId, filter));
}

function useMinimiumCountSortingFlows(aggregationPromise, filter) {
  const flowsSortedByStartCountPromise =
    Activity.aggregate(sortFlowsByStartCountAggregationPipeline(filter));

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

          const countLocal = typeof count === 'number' ? count : 0;

          let countStart = flowsSortedByStartCountMap.get(id.toString());
          countStart = typeof countStart === 'number' ? countStart : 0;

          return {
            count: Math.min(countLocal, countStart),
            flow,
          };
        })
        .sort((a, b) => b.count - a.count);
    });
}

function useMinimiumCountSortingSteps(flowId, aggregationPromise, filter) {
  const stepsSortedByStartCountPromise =
    Step.aggregate(sortStepsByStartCountAggregationPipeline(flowId, filter));

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

          const countLocal = typeof count === 'number' ? count : 0;

          let countStart = stepsSortedByStartCountMap.get(id.toString());
          countStart = typeof countStart === 'number' ? countStart : 0;

          return {
            count: Math.min(countLocal, countStart),
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
