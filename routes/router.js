const router = require('express').Router();

router.use('/flows', require('./flow'));
router.use('/users', require('./user'));

module.exports = router;
