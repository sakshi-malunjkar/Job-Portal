const Company = require('../models/Company');
const User = require('../models/User');

// @desc    Create a company
// @route   POST /api/companies
const createCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;

    // Check if recruiter already has a company
    const existingCompany = await Company.findOne({ recruiter: req.user._id });
    if (existingCompany) {
      return res.status(400).json({ message: 'You already have a company profile' });
    }

    const company = await Company.create({
      name,
      description,
      website,
      location,
      recruiter: req.user._id,
    });

    // Link company to the recruiter's user profile
    await User.findByIdAndUpdate(req.user._id, { company: company._id });

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my company
// @route   GET /api/companies/my
const getMyCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ recruiter: req.user._id });
    if (!company) {
      return res.status(404).json({ message: 'No company found. Please create one.' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update company
// @route   PUT /api/companies/:id
const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Make sure only the owner can update
    if (company.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this company' });
    }

    const { name, description, website, location } = req.body;

    company.name        = name        || company.name;
    company.description = description || company.description;
    company.website     = website     || company.website;
    company.location    = location    || company.location;

    const updatedCompany = await company.save();
    res.json(updatedCompany);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all companies (public)
// @route   GET /api/companies
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate('recruiter', 'name email');
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCompany, getMyCompany, updateCompany, getAllCompanies };