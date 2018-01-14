const router = require('express').Router();
const Joi = require('joi');
const idSchema = require('../schemas/id');
const service = require('../services/report');

router.get('/most-canceled-flows', (req, res) => {
  // It assumes that a flow to be canceled needs only an activity to cancel
  service
    .sortFlowsByCancelCount()
    .then((flows) => {
      res.status(200).json(flows);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

router.get('/most-canceled-flows-alternative', (req, res) => {
  // It assumes that a flow to be canceled needs to start and then cancel
  service
    .sortFlowsByCancelCountAlternative()
    .then((flows) => {
      res.status(200).json(flows);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

router.get('/most-canceled-steps/:flowId', (req, res) => {
  // It assumes that a step to be canceled needs only an activity to cancel
  Joi
    .validate(req.params.flowId, idSchema)
    .then((flowId) => {
      service
        .sortStepsByCancelCount(flowId)
        .then((steps) => {
          res.status(200).json(steps);
        })
        .catch(() => {
          res.sendStatus(500);
        });
    })
    .catch(error => res.status(422).json(error));
});

router.get('/most-canceled-steps-alternative/:flowId', (req, res) => {
  // It assumes that a step to be canceled needs to start and then cancel
  Joi
    .validate(req.params.flowId, idSchema)
    .then((flowId) => {
      service
        .sortStepsByCancelCountAlternative(flowId)
        .then((steps) => {
          res.status(200).json(steps);
        })
        .catch(() => {
          res.sendStatus(500);
        });
    })
    .catch(error => res.status(422).json(error));
});

router.get('/most-completed-flows', (req, res) => {
  // It assumes that a flow to be completed needs only an activity to end
  service
    .sortFlowsByEndCount()
    .then((flows) => {
      res.status(200).json(flows);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

router.get('/most-completed-flows-alternative', (req, res) => {
  // It assumes that a flow to be ended needs to start and then end
  service
    .sortFlowsByEndCountAlternative()
    .then((flows) => {
      res.status(200).json(flows);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

router.get('/most-completed-steps/:flowId', (req, res) => {
  // It assumes that a step to be completed needs only an activity to end
  Joi
    .validate(req.params.flowId, idSchema)
    .then((flowId) => {
      service
        .sortStepsByEndCount(flowId)
        .then((steps) => {
          res.status(200).json(steps);
        })
        .catch(() => {
          res.sendStatus(500);
        });
    })
    .catch(error => res.status(422).json(error));
});

router.get('/most-completed-steps-alternative/:flowId', (req, res) => {
  // It assumes that a step to be ended needs to start and then end
  Joi
    .validate(req.params.flowId, idSchema)
    .then((flowId) => {
      service
        .sortStepsByEndCountAlternative(flowId)
        .then((steps) => {
          res.status(200).json(steps);
        })
        .catch(() => {
          res.sendStatus(500);
        });
    })
    .catch(error => res.status(422).json(error));
});

router.get('/most-used-flows', (req, res) => {
  // It assumes that a flow to be used needs only an activity to start
  service
    .sortFlowsByStartCount()
    .then((flows) => {
      res.status(200).json(flows);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

router.get('/most-used-steps/:flowId', (req, res) => {
  // It assumes that a step to be used needs only an activity to start
  Joi
    .validate(req.params.flowId, idSchema)
    .then((flowId) => {
      service
        .sortStepsByStartCount(flowId)
        .then((steps) => {
          res.status(200).json(steps);
        })
        .catch(() => {
          res.sendStatus(500);
        });
    })
    .catch(error => res.status(422).json(error));
});

module.exports = router;
