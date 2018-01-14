const router = require('express').Router();
// const Joi = require('joi');
const service = require('../services/flow');

router.get('/', (req, res) => {
  service
    .getAll()
    .then(flows => res.status(200).json(flows))
    .catch(() => res.sendStatus(500));
});

module.exports = router;
