const flowService = require('./flow');
const stepService = require('./step');
const userService = require('./user');
const EntityNotFoundError = require('../errors/entityNotFound');
const Activity = require('../models/activity');

function create(creationParameterObject) {
  const {
    ref,
    user,
    status,
    type,
  } = creationParameterObject;

  const isFlow = type === 'flow';
  const refValidationPromise = isFlow ? flowService.exists(ref) : stepService.exists(ref);
  const userValidationPromise = userService.exists(user);

  return new Promise((resolve, reject) => {
    Promise
      .all([refValidationPromise, userValidationPromise])
      .then(([doesRefExists, doesUserExists]) => {
        if (!doesRefExists) {
          reject(new EntityNotFoundError(isFlow ? 'flow' : 'step', ref));
        } else if (!doesUserExists) {
          reject(new EntityNotFoundError('user', user));
        } else {
          const newActivity = new Activity({ user, status, type });

          if (isFlow) {
            newActivity.flow = ref;
          } else {
            newActivity.step = ref;
          }

          newActivity.save()
            .then(({ _id }) => {
              resolve(_id);
            })
            .catch((error) => {
              reject(error);
            });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports = { create };
