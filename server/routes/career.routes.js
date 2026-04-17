const express = require('express');
const router = express.Router();
const { getCareerConfig, addCareerSkill, generateMatches, getCareerDetail } = require('../controllers/careerController');
const { dbReady } = require('../middleware/dbReady');

router.get('/config', dbReady, getCareerConfig);
router.post('/skills', dbReady, addCareerSkill);
router.post('/generate', dbReady, generateMatches);
router.post('/detail', dbReady, getCareerDetail);

module.exports = router;
