const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user (recruiter or candidate)
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists with this email and role
    const userExists = await User.findOne({ email, role });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email for this role' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    if (user) {
      res.status(201).json({
        _id:   user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
        skills: user.skills || [],
        resume: user.resume || '',
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find user by email and role (if provided)
    const query = role ? { email, role } : { email };
    const user = await User.findOne(query);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email, password, or role' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id:     user._id,
      name:    user.name,
      email:   user.email,
      role:    user.role,
      skills:  user.skills || [],
      resume:  user.resume || '',
      token:   generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user profile
// @route   GET /api/auth/profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile by ID
// @route   GET /api/auth/user/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name email role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user resume inline from MongoDB
// @route   GET /api/auth/resume/:userId
const getUserResume = async (req, res) => {
  try {
    const Resume = require('../models/Resume');
    const resume = await Resume.findOne({ user: req.params.userId });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    // Set response headers to display inline PDF/document and disable caching
    res.set({
      'Content-Type': resume.contentType,
      'Content-Disposition': `inline; filename="${resume.filename}"`,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    });
    res.send(resume.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, getUserById, getUserResume };