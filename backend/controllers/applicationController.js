const Application  = require('../models/Application');
const Job           = require('../models/Job');
const Notification  = require('../models/Notification');

const applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId).populate('postedBy');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const alreadyApplied = await Application.findOne({
      job:       req.params.jobId,
      applicant: req.user._id,
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    const application = await Application.create({
      job:       req.params.jobId,
      applicant: req.user._id,
    });

    // Notify recruiter of new applicant
    await Notification.create({
      recipient: job.postedBy._id,
      type:      'new_applicant',
      title:     'New applicant',
      message:   `${req.user.name} applied to your ${job.title} posting`,
      application: application._id,
      job:       job._id,
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title location salary')
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logo' },
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getApplicantsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email skills resume')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status, interviewDetails } = req.body;

    const validStatuses = ['pending', 'shortlisted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('applicant', 'name');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    // Build notification content based on new status
    let title, message;
    if (status === 'shortlisted') {
      title   = 'You have been shortlisted! 🎉';
      message = `Great news! You've been shortlisted for ${application.job.title}.`;
      if (interviewDetails?.date) {
        message += ` Interview scheduled on ${interviewDetails.date}${interviewDetails.time ? ` at ${interviewDetails.time}` : ''}.`;
      }
    } else if (status === 'rejected') {
      title   = 'Application update';
      message = `Your application for ${application.job.title} was not selected this time.`;
    } else {
      title   = 'Application status updated';
      message = `Your application for ${application.job.title} is now pending review.`;
    }

    await Notification.create({
      recipient:   application.applicant._id,
      type:        'application_status',
      title,
      message,
      application: application._id,
      job:         application.job._id,
      interviewDetails: status === 'shortlisted' ? interviewDetails : undefined,
    });

    res.json({ message: `Application ${status} successfully`, application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecruiterApplications = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id });
    const jobIds = jobs.map(j => j._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('applicant', 'name email skills resume')
      .populate('job', 'title')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
  getRecruiterApplications,
};