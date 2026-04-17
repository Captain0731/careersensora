const express = require('express');
const router = express.Router();
const { getParallelConfig, compareDomains } = require('../controllers/parallelController');

router.get('/config', getParallelConfig);
router.post('/compare', compareDomains);

module.exports = router;
