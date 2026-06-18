const express = require('express');
const router  = express.Router();
const {
  createCompany,
  getMyCompany,
  updateCompany,
  getAllCompanies,
} = require('../controllers/companyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',     getAllCompanies);           // public
router.post('/',    protect, createCompany);    // recruiter only
router.get('/my',   protect, getMyCompany);     // recruiter only
router.put('/:id',  protect, updateCompany);    // recruiter only

module.exports = router;