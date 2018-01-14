const service = require('../services/user');
const createRouter = require('../utils/createRouter');

const router = createRouter(service);

module.exports = router;
