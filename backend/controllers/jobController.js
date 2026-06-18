const Job     = require('../models/Job');
const Company = require('../models/Company');

// @desc    Post a new job
// @route   POST /api/jobs
const createJob = async (req, res) => {
  try {
    const { title, description, location, salary, skills, companyName } = req.body;

    // Recruiter must have a company first
    if (!req.user.company) {
      return res.status(400).json({ message: 'Please create a company profile first' });
    }

    const job = await Job.create({
      title,
      description,
      location,
      salary,
      skills,
      companyName,
      company:  req.user.company,
      postedBy: req.user._id,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all jobs (with optional search)
// @route   GET /api/jobs
const getAllJobs = async (req, res) => {
  try {
    const { keyword, location } = req.query;

    // Build search filter dynamically
    let filter = {};

    if (keyword) {
      // Find companies matching the keyword to support searching by company profiles
      const matchingCompanies = await Company.find({ name: { $regex: keyword, $options: 'i' } }).select('_id');
      const companyIds = matchingCompanies.map(c => c._id);

      filter.$or = [
        { title:       { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { skills:      { $regex: keyword, $options: 'i' } },
        { companyName: { $regex: keyword, $options: 'i' } },
        { company:     { $in: companyIds } }
      ];
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    const jobs = await Job.find(filter)
      .populate('company', 'name location logo')
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 }); // newest first

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'name description website location logo')
      .populate('postedBy', 'name email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get jobs posted by logged-in recruiter
// @route   GET /api/jobs/my
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id })
      .populate('company', 'name location logo')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Only the recruiter who posted can update
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const { title, description, location, salary, skills } = req.body;

    job.title       = title       || job.title;
    job.description = description || job.description;
    job.location    = location    || job.location;
    job.salary      = salary      || job.salary;
    job.skills      = skills      || job.skills;

    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Only the recruiter who posted can delete
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createJob, getAllJobs, getJobById, getMyJobs, updateJob, deleteJob };