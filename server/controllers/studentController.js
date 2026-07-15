import Student from '../models/Student.js';
import User from '../models/User.js';
import Application from '../models/Application.js';
import Job from '../models/Job.js';

// @desc    Get student profile
// @route   GET /api/students/profile
export const getProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id })
      .populate('department', 'name code').populate('savedJobs');
    if (!student) return res.status(404).json({ success: false, message: 'Profile not found' });
    res.status(200).json({ success: true, student });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Update student profile
// @route   PUT /api/students/profile
export const updateProfile = async (req, res) => {
  try {
    const fields = ['enrollmentNo','semester','passingYear','cgpa','program','tenthPercentage','twelfthPercentage','diplomaPercentage','skills','projects','certificates','experience','portfolio','github','linkedin','dateOfBirth','gender','address'];
    const updates = {};
    fields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    const student = await Student.findOneAndUpdate({ user: req.user.id }, { $set: updates }, { new: true, runValidators: true }).populate('department', 'name code');
    if (req.body.name || req.body.phone) await User.findByIdAndUpdate(req.user.id, { ...(req.body.name && { name: req.body.name }), ...(req.body.phone && { phone: req.body.phone }) });
    res.status(200).json({ success: true, message: 'Profile updated', student });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Apply for a job
// @route   POST /api/students/apply/:jobId
export const applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job || job.status !== 'active') return res.status(400).json({ success: false, message: 'Job not available' });
    const student = await Student.findOne({ user: req.user.id });
    const existing = await Application.findOne({ job: req.params.jobId, student: student._id });
    if (existing) return res.status(400).json({ success: false, message: 'Already applied' });
    if (job.eligibility.minCGPA && student.cgpa < job.eligibility.minCGPA) return res.status(400).json({ success: false, message: 'CGPA requirement not met' });
    const application = await Application.create({ job: req.params.jobId, student: student._id, user: req.user.id, resume: student.resume, coverLetter: req.body.coverLetter, statusHistory: [{ status: 'applied', changedBy: req.user.id }] });
    job.totalApplications += 1; job.applications.push(application._id); await job.save();
    res.status(201).json({ success: true, message: 'Applied successfully', application });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Get my applications
// @route   GET /api/students/applications
export const getMyApplications = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    const { status, page = 1, limit = 10 } = req.query;
    const query = { student: student._id };
    if (status) query.status = status;
    const total = await Application.countDocuments(query);
    const applications = await Application.find(query).populate({ path: 'job', select: 'title company jobType workMode location package deadline status', populate: { path: 'company', select: 'name logo' } }).sort('-appliedAt').skip((page - 1) * limit).limit(Number(limit));
    res.status(200).json({ success: true, total, totalPages: Math.ceil(total / limit), currentPage: Number(page), applications });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Save/unsave a job
// @route   PUT /api/students/save-job/:jobId
export const toggleSaveJob = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    const idx = student.savedJobs.indexOf(req.params.jobId);
    if (idx > -1) student.savedJobs.splice(idx, 1); else student.savedJobs.push(req.params.jobId);
    await student.save();
    res.status(200).json({ success: true, message: idx > -1 ? 'Removed' : 'Saved', savedJobs: student.savedJobs });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Get saved jobs
// @route   GET /api/students/saved-jobs
export const getSavedJobs = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id }).populate({ path: 'savedJobs', populate: { path: 'company', select: 'name logo location' } });
    res.status(200).json({ success: true, savedJobs: student.savedJobs });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Get all students (for recruiters/TPO)
// @route   GET /api/students
export const getStudents = async (req, res) => {
  try {
    const { department, skills, minCGPA, passingYear, isPlaced, page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const query = {};
    if (department) query.department = department;
    if (minCGPA) query.cgpa = { $gte: Number(minCGPA) };
    if (passingYear) query.passingYear = Number(passingYear);
    if (isPlaced !== undefined) query.isPlaced = isPlaced === 'true';
    if (skills) query.skills = { $in: skills.split(',').map(s => s.trim()) };
    if (req.user.role === 'coordinator') query.department = req.user.department;
    const total = await Student.countDocuments(query);
    const students = await Student.find(query).populate('user', 'name email phone avatar isVerified isApproved').populate('department', 'name code').sort(sort).skip((page - 1) * limit).limit(Number(limit));
    res.status(200).json({ success: true, total, totalPages: Math.ceil(total / limit), currentPage: Number(page), students });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Get placement drives for students
// @route   GET /api/students/placement-drives
export const getPlacementDrivesForStudents = async (req, res) => {
  try {
    const { default: PlacementDrive } = await import('../models/PlacementDrive.js');
    const drives = await PlacementDrive.find()
      .populate('company', 'name logo location')
      .populate('eligibleDepartments', 'name code')
      .sort('-date');
    res.status(200).json({ success: true, drives });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register for placement drive
// @route   POST /api/students/placement-drives/:id/register
export const registerForPlacementDrive = async (req, res) => {
  try {
    const { default: PlacementDrive } = await import('../models/PlacementDrive.js');
    const student = await Student.findOne({ user: req.user.id });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });
    
    const drive = await PlacementDrive.findById(req.params.id);
    if (!drive) return res.status(404).json({ success: false, message: 'Placement drive not found' });
    
    if (drive.registeredStudents.includes(student._id)) {
      return res.status(400).json({ success: false, message: 'Already registered' });
    }
    
    if (drive.minCGPA && student.cgpa < drive.minCGPA) {
      return res.status(400).json({ success: false, message: `CGPA requirement not met (${drive.minCGPA})` });
    }
    
    drive.registeredStudents.push(student._id);
    await drive.save();
    
    res.status(200).json({ success: true, message: 'Registered successfully', drive });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get training programs for students
// @route   GET /api/students/training-programs
export const getTrainingProgramsForStudents = async (req, res) => {
  try {
    const { default: TrainingProgram } = await import('../models/TrainingProgram.js');
    const programs = await TrainingProgram.find()
      .populate('departments', 'name code')
      .sort('-startDate');
    res.status(200).json({ success: true, programs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register for training program
// @route   POST /api/students/training-programs/:id/register
export const registerForTrainingProgram = async (req, res) => {
  try {
    const { default: TrainingProgram } = await import('../models/TrainingProgram.js');
    const student = await Student.findOne({ user: req.user.id });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });
    
    const program = await TrainingProgram.findById(req.params.id);
    if (!program) return res.status(404).json({ success: false, message: 'Training program not found' });
    
    if (program.registeredStudents.includes(student._id)) {
      return res.status(400).json({ success: false, message: 'Already registered' });
    }
    
    if (program.maxParticipants && program.registeredStudents.length >= program.maxParticipants) {
      return res.status(400).json({ success: false, message: 'Program is full' });
    }
    
    program.registeredStudents.push(student._id);
    await program.save();
    
    res.status(200).json({ success: true, message: 'Registered successfully', program });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
