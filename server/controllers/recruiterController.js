import Company from '../models/Company.js';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { sendEmail, emailTemplates } from '../utils/email.js';

// @desc    Register company
// @route   POST /api/recruiter/company
export const registerCompany = async (req, res) => {
  try {
    const company = await Company.create({ ...req.body, recruiters: [req.user.id] });
    res.status(201).json({ success: true, message: 'Company registered. Pending verification.', company });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Get recruiter's company
// @route   GET /api/recruiter/company
export const getMyCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ recruiters: req.user.id });
    if (!company) return res.status(404).json({ success: false, message: 'No company found' });
    res.status(200).json({ success: true, company });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Update company
// @route   PUT /api/recruiter/company/:id
export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findOneAndUpdate({ _id: req.params.id, recruiters: req.user.id }, req.body, { new: true, runValidators: true });
    if (!company) return res.status(404).json({ success: false, message: 'Company not found or unauthorized' });
    res.status(200).json({ success: true, company });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Get applications for recruiter's jobs
// @route   GET /api/recruiter/applications
export const getApplications = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).select('_id');
    const jobIds = jobs.map(j => j._id);
    const { status, jobId, page = 1, limit = 20 } = req.query;
    const query = { job: { $in: jobIds } };
    if (status) query.status = status;
    if (jobId) query.job = jobId;
    const total = await Application.countDocuments(query);
    const applications = await Application.find(query)
      .populate({ path: 'student', populate: { path: 'department', select: 'name code' } })
      .populate('user', 'name email phone avatar')
      .populate('job', 'title jobType')
      .sort('-appliedAt').skip((page - 1) * limit).limit(Number(limit));
    res.status(200).json({ success: true, total, totalPages: Math.ceil(total / limit), currentPage: Number(page), applications });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Update application status (shortlist/reject/select)
// @route   PUT /api/recruiter/applications/:id
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, remarks, interviewSchedule } = req.body;
    const updates = { status, $push: { statusHistory: { status, changedBy: req.user.id, remarks } } };
    if (interviewSchedule) updates.interviewSchedule = interviewSchedule;
    const application = await Application.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate('user', 'name email').populate({ path: 'job', populate: { path: 'company', select: 'name' } });
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    // Send email notification
    await sendEmail({ to: application.user.email, subject: `Application Update - ${application.job.title}`, html: emailTemplates.applicationStatus(application.user.name, application.job.title, application.job.company.name, status) });
    res.status(200).json({ success: true, message: 'Status updated', application });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const getDashboard = async (req, res) => {
  try {
    const company = await Company.findOne({ recruiters: req.user.id });
    if (!company) {
      return res.status(200).json({
        success: true,
        stats: {
          totalPostings: 0,
          activePostings: 0,
          applicationsReceived: 0,
          shortlistedCandidates: 0,
          hiredCandidates: 0
        },
        company: null,
        recentApplications: []
      });
    }
    const totalJobs = await Job.countDocuments({ postedBy: req.user.id });
    const activeJobs = await Job.countDocuments({ postedBy: req.user.id, status: 'active' });
    const jobs = await Job.find({ postedBy: req.user.id }).select('_id');
    const jobIds = jobs.map(j => j._id);
    const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });
    const shortlisted = await Application.countDocuments({ job: { $in: jobIds }, status: 'shortlisted' });
    const selected = await Application.countDocuments({ job: { $in: jobIds }, status: 'selected' });
    const recentApplications = await Application.find({ job: { $in: jobIds } }).populate('user', 'name email avatar').populate('job', 'title').sort('-appliedAt').limit(5);
    res.status(200).json({
      success: true,
      stats: {
        totalPostings: totalJobs,
        activePostings: activeJobs,
        applicationsReceived: totalApplications,
        shortlistedCandidates: shortlisted,
        hiredCandidates: selected
      },
      company,
      recentApplications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
