const service = require('../services/flow');
const createRouter = require('../utils/createRouter');

const router = createRouter(service);

module.exports = router;
