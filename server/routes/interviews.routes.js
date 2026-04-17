const express = require('express');
const router = express.Router();
const { startInterview, submitAnswer, getResults } = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

router.post('/start', startInterview);
router.post('/:sessionId/answer', submitAnswer);
router.get('/:sessionId/results', getResults);

module.exports = router;
