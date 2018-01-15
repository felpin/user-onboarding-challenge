const { ObjectId } = require('mongoose').Types;
const Activity = require('../models/activity');

function getUsersWhoStartedFlow(id, filter) {
  return getUsersWhoDidActivity('flow', 'start', id, filter);
}

function getUsersWhoEndedFlow(id, filter) {
  return getUsersWhoDidActivity('flow', 'end', id, filter);
}

function getUsersWhoCanceledFlow(id, filter) {
  return getUsersWhoDidActivity('flow', 'cancel', id, filter);
}

function getUsersWhoStartedStep(id, filter) {
  return getUsersWhoDidActivity('step', 'start', id, filter);
}

function getUsersWhoEndedStep(id, filter) {
  return getUsersWhoDidActivity('step', 'end', id, filter);
}

function getUsersWhoCanceledStep(id, filter) {
  return getUsersWhoDidActivity('step', 'cancel', id, filter);
}

function getUsersWhoDidActivity(type, status, id, filter) {
  return Activity
    .aggregate(getUsersWhoDidActivityAggregationPipeline(type, status, id, filter))
    .then(users => users.map(user => user.user));
}

function getUsersWhoDidActivityAggregationPipeline(type, status, id, filter) {
  const aggregationMatch = { type, status };

  if (filter && (filter.since || filter.until)) {
    aggregationMatch.occured = {};

    if (filter.since) {
      aggregationMatch.occured.$gte = filter.since;
    }

    if (filter.until) {
      aggregationMatch.occured.$lt = filter.until;
    }
  }

  const matchObject = type === 'flow' ? { flow: ObjectId(id) } : { step: ObjectId(id) };

  return [
    { $match: Object.assign(aggregationMatch, matchObject) },
    { $group: { _id: '$user' } },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 0,
        user: {
          id: '$user._id',
          name: '$user.name',
          email: '$user.email',
          alias: '$user.alias',
        },
      },
    },
  ];
}

module.exports = {
  getUsersWhoCanceledFlow,
  getUsersWhoCanceledStep,
  getUsersWhoEndedFlow,
  getUsersWhoEndedStep,
  getUsersWhoStartedFlow,
  getUsersWhoStartedStep,
};
