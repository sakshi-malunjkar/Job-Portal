const express = require('express');
const router  = express.Router();
const {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
  getRecruiterApplications,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/recruiter',        protect, getRecruiterApplications); // recruiter
router.post('/:jobId',          protect, applyToJob);             // candidate
router.get('/my',               protect, getMyApplications);      // candidate
router.get('/job/:jobId',       protect, getApplicantsForJob);    // recruiter
router.put('/:id/status',       protect, updateApplicationStatus);// recruiter

module.exports = router;