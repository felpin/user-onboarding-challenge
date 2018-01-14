const router = require('express').Router();

router.use('/flows', require('./flow'));

module.exports = router;
