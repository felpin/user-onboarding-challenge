const router = require('express').Router();
const Joi = require('joi');
const dateFilterSchema = require('../schemas/dateFilter');
const idSchema = require('../schemas/id');
const service = require('../services/report');

function configureFlowRouter(req, res, sortFlowsFunction) {
  Joi
    .validate(req.query, dateFilterSchema)
    .then((query) => {
      sortFlowsFunction(query)
        .then((flows) => {
          res.status(200).json(flows);
        })
        .catch(() => {
          res.sendStatus(500);
        });
    })
    .catch(error => res.status(422).json(error));
}

function configureStepRouter(req, res, sortStepsFunction) {
  const validateFlowId = Joi.validate(req.params.flowId, idSchema);
  const validateQuery = Joi.validate(req.query, dateFilterSchema);

  Promise
    .all([validateFlowId, validateQuery])
    .then(([flowId, query]) => {
      sortStepsFunction(flowId, query)
        .then((steps) => {
          res.status(200).json(steps);
        })
        .catch(() => {
          res.sendStatus(500);
        });
    })
    .catch(error => res.status(422).json(error));
}

router.get('/most-canceled-flows', (req, res) => {
  // It assumes that a flow to be canceled needs only an activity to cancel
  configureFlowRouter(req, res, service.sortFlowsByCancelCount);
});

router.get('/most-canceled-flows-alternative', (req, res) => {
  // It assumes that a flow to be canceled needs to start and then cancel
  configureFlowRouter(req, res, service.sortFlowsByCancelCountAlternative);
});

router.get('/most-canceled-steps/:flowId', (req, res) => {
  // It assumes that a step to be canceled needs only an activity to cancel
  configureStepRouter(req, res, service.sortStepsByCancelCount);
});

router.get('/most-canceled-steps-alternative/:flowId', (req, res) => {
  // It assumes that a step to be canceled needs to start and then cancel
  configureStepRouter(req, res, service.sortStepsByCancelCountAlternative);
});

router.get('/most-completed-flows', (req, res) => {
  // It assumes that a flow to be completed needs only an activity to end
  configureFlowRouter(req, res, service.sortFlowsByEndCount);
});

router.get('/most-completed-flows-alternative', (req, res) => {
  // It assumes that a flow to be ended needs to start and then end
  configureFlowRouter(req, res, service.sortFlowsByEndCountAlternative);
});

router.get('/most-completed-steps/:flowId', (req, res) => {
  // It assumes that a step to be completed needs only an activity to end
  configureStepRouter(req, res, service.sortStepsByEndCount);
});

router.get('/most-completed-steps-alternative/:flowId', (req, res) => {
  // It assumes that a step to be ended needs to start and then end
  configureStepRouter(req, res, service.sortStepsByEndCountAlternative);
});

router.get('/most-used-flows', (req, res) => {
  // It assumes that a flow to be used needs only an activity to start
  configureFlowRouter(req, res, service.sortFlowsByStartCount);
});

router.get('/most-used-steps/:flowId', (req, res) => {
  // It assumes that a step to be used needs only an activity to start
  configureStepRouter(req, res, service.sortStepsByStartCount);
});

module.exports = router;
