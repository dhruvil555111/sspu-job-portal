import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Company from '../models/Company.js';

/**
 * Job Controller - CRUD operations for job postings
 */

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Recruiter, TPO, SuperAdmin)
export const createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      postedBy: req.user.id,
    };

    // Auto-approve if posted by TPO or SuperAdmin
    if (['tpo', 'superadmin'].includes(req.user.role)) {
      jobData.isApprovedByTPO = true;
    }

    const job = await Job.create(jobData);
    await job.populate('company', 'name logo');

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      job,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all jobs with filters
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  try {
    const {
      search, department, jobType, workMode, location,
      minPackage, maxPackage, skills, passingYear,
      company, status, page = 1, limit = 12, sort = '-createdAt',
    } = req.query;

    const query = {};

    // Only show active and approved jobs to public
    if (!req.user || !['tpo', 'superadmin'].includes(req.user?.role)) {
      query.status = 'active';
      query.isApprovedByTPO = true;
      query.deadline = { $gte: new Date() };
    } else if (status) {
      query.status = status;
    }

    // Search
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    if (department) {
      query['eligibility.departments'] = department;
    }
    if (jobType) query.jobType = jobType;
    if (workMode) query.workMode = workMode;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (company) query.company = company;
    if (minPackage) query['package.min'] = { $gte: Number(minPackage) };
    if (maxPackage) query['package.max'] = { $lte: Number(maxPackage) };
    if (skills) {
      const skillArr = skills.split(',').map(s => s.trim());
      query.requiredSkills = { $in: skillArr };
    }
    if (passingYear) {
      query['eligibility.passingYears'] = Number(passingYear);
    }

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('company', 'name logo location industry')
      .populate('eligibility.departments', 'name code')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company')
      .populate('eligibility.departments', 'name code')
      .populate('postedBy', 'name email');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Owner, TPO, SuperAdmin)
export const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user.id && !['tpo', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('company', 'name logo');

    res.status(200).json({ success: true, message: 'Job updated', job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Owner, TPO, SuperAdmin)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.id && !['tpo', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await job.deleteOne();
    res.status(200).json({ success: true, message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve job (TPO)
// @route   PUT /api/jobs/:id/approve
// @access  Private (TPO, SuperAdmin)
export const approveJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { isApprovedByTPO: true, status: 'active' },
      { new: true }
    ).populate('company', 'name logo');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({ success: true, message: 'Job approved', job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get featured/latest jobs for homepage
// @route   GET /api/jobs/featured
// @access  Public
export const getFeaturedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      status: 'active',
      isApprovedByTPO: true,
      deadline: { $gte: new Date() },
    })
      .populate('company', 'name logo location')
      .sort('-createdAt')
      .limit(8);

    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
