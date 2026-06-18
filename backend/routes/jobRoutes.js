const express = require('express');
const router  = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',      getAllJobs);                // public
router.post('/',     protect, createJob);        // recruiter only
router.get('/my',    protect, getMyJobs);        // recruiter only
router.get('/:id',   getJobById);               // public
router.put('/:id',   protect, updateJob);        // recruiter only
router.delete('/:id',protect, deleteJob);        // recruiter only

module.exports = router;