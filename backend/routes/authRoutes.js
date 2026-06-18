const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const path     = require('path');
const { registerUser, loginUser, getUserProfile, getUserById, getUserResume } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const User     = require('../models/User');

// Multer config (use memory storage for MongoDB file persistence)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/register',       registerUser);
router.post('/login',          loginUser);
router.get('/profile',         protect, getUserProfile);
router.get('/user/:id',        protect, getUserById);
router.get('/resume/:userId',  getUserResume);

// Update profile + resume upload
router.put('/profile', protect, upload.single('resume'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, skills } = req.body;
    if (name)   user.name   = name;
    if (skills) user.skills = skills.split(',').map(s => s.trim());
    if (req.file) {
      const Resume = require('../models/Resume');
      await Resume.findOneAndUpdate(
        { user: user._id },
        { 
          data: req.file.buffer, 
          contentType: req.file.mimetype, 
          filename: req.file.originalname 
        },
        { upsert: true, new: true }
      );
      user.resume = `api/auth/resume/${user._id}`;
    }
    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;