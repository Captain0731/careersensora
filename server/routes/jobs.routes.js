const express = require('express');
const router = express.Router();
const { getJobsMeta, listJobs, getJobDetail, applyToJob, analyzeResume, analyzeResumeGeneral, listJobsManage } = require('../controllers/jobsController');
const { protect, recruiterOnly } = require('../middleware/auth');

const multer = require('multer');
const upload = multer();

router.get('/meta', getJobsMeta);
router.get('/', listJobs);
router.get('/manage/list', protect, recruiterOnly, listJobsManage);
router.get('/:id', getJobDetail);
router.post('/apply', applyToJob);
router.post('/resume-analysis', upload.single('resume'), analyzeResumeGeneral);
router.post('/applications/:id/resume-analysis', upload.single('resume'), analyzeResume);

module.exports = router;
