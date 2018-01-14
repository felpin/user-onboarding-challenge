const router = require('express').Router();
const service = require('../services/report');

router.get('/most-completed-flows', (req, res) => {
  service
    .getMostCompletedFlows()
    .then((flows) => {
      res.status(200).json(flows);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

router.get('/most-used-flows', (req, res) => {
  service
    .getMostUsedFlows()
    .then((flows) => {
      res.status(200).json(flows);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

module.exports = router;
