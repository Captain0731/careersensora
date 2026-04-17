const express = require('express');
const router = express.Router();
const { getCareerConfig, generateMatches, getCareerDetail } = require('../controllers/careerController');

router.get('/config', getCareerConfig);
router.post('/generate', generateMatches);
router.post('/detail', getCareerDetail);

module.exports = router;
