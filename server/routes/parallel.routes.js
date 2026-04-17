const express = require('express');
const router = express.Router();
const { getParallelConfig, compareDomains } = require('../controllers/parallelController');
const { dbReady } = require('../middleware/dbReady');

router.get('/config', dbReady, getParallelConfig);
router.post('/compare', dbReady, compareDomains);

module.exports = router;
