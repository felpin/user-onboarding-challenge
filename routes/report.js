const router = require('express').Router();
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

module.exports = router;
