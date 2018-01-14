const { ObjectId } = require('mongoose').Types;
const Activity = require('../models/activity');

function getUsersWhoStartedFlow(id) {
  return getUsersWhoDidActivity('flow', 'start', id);
}

function getUsersWhoEndedFlow(id) {
  return getUsersWhoDidActivity('flow', 'end', id);
}

function getUsersWhoCanceledFlow(id) {
  return getUsersWhoDidActivity('flow', 'cancel', id);
}

function getUsersWhoStartedStep(id) {
  return getUsersWhoDidActivity('step', 'start', id);
}

function getUsersWhoEndedStep(id) {
  return getUsersWhoDidActivity('step', 'end', id);
}

function getUsersWhoCanceledStep(id) {
  return getUsersWhoDidActivity('step', 'cancel', id);
}

function getUsersWhoDidActivity(type, status, id) {
  return Activity
    .aggregate(getUsersWhoDidActivityAggregationPipeline(type, status, id))
    .then(users => users.map(user => user.user));
}

function getUsersWhoDidActivityAggregationPipeline(type, status, id) {
  const matchObject = type === 'flow' ? { flow: ObjectId(id) } : { step: ObjectId(id) };

  return [
    { $match: Object.assign({ type, status }, matchObject) },
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
