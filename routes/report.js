const router = require('express').Router();
const service = require('../services/report');

router.get('/most-used-flows', (req, res) => {
  service
    .getMostUsedFlows()
    .then((mostUsedFlows) => {
      res.status(200).json(mostUsedFlows);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

module.exports = router;
