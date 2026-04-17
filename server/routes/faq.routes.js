const express = require('express');
const router = express.Router();
const { faqChat } = require('../controllers/faqController');

router.post('/', faqChat);

module.exports = router;
