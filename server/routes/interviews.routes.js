const express = require('express');
const router = express.Router();
const { startInterview, submitAnswer, getResults } = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');
const { dbReady } = require('../middleware/dbReady');

router.post('/start', dbReady, startInterview);
router.post('/:sessionId/answer', dbReady, submitAnswer);
router.get('/:sessionId/results', dbReady, getResults);

module.exports = router;
