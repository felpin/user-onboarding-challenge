const router = require('express').Router();

router.use('/flows', require('./flow'));
router.use('/reports', require('./report'));
router.use('/users', require('./user'));

module.exports = router;
