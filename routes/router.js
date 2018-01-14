const router = require('express').Router();

router.use('/activities', require('./activity'));
router.use('/flows', require('./flow'));
router.use('/reports', require('./report'));
router.use('/steps', require('./step'));
router.use('/users', require('./user'));
router.use('/user-reports', require('./userReport'));

module.exports = router;
