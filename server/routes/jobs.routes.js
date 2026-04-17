const express = require('express');
const router = express.Router();
const { getJobsMeta, listJobs, getJobDetail, applyToJob, analyzeResume, analyzeResumeGeneral, listJobsManage } = require('../controllers/jobsController');
const { protect, recruiterOnly } = require('../middleware/auth');
const { dbReady } = require('../middleware/dbReady');

const multer = require('multer');
const upload = multer();

router.get('/meta', getJobsMeta);
router.get('/', dbReady, listJobs);
router.get('/manage/list', dbReady, protect, recruiterOnly, listJobsManage);
router.get('/:id', dbReady, getJobDetail);
router.post('/apply', dbReady, applyToJob);
router.post('/resume-analysis', upload.single('resume'), analyzeResumeGeneral);
router.post('/applications/:id/resume-analysis', dbReady, upload.single('resume'), analyzeResume);

module.exports = router;
