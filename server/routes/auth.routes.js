const express = require('express');
const router = express.Router();
const { signup, login, recruiterLogin, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { dbReady } = require('../middleware/dbReady');

router.post('/signup', dbReady, signup);
router.post('/login', dbReady, login);
router.post('/recruiter-login', dbReady, recruiterLogin);
router.get('/me', dbReady, protect, getMe);

module.exports = router;
