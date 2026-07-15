import User from '../models/User.js';
import Student from '../models/Student.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Department from '../models/Department.js';
import PlacementDrive from '../models/PlacementDrive.js';
import TrainingProgram from '../models/TrainingProgram.js';
import Notification from '../models/Notification.js';

// @desc    Admin dashboard stats
// @route   GET /api/admin/dashboard
export const getDashboard = async (req, res) => {
  try {
    const [totalStudents, totalCompanies, totalJobs, totalApplications, totalDepartments, placedStudents, activeJobs, pendingCompanies] = await Promise.all([
      Student.countDocuments(), Company.countDocuments(), Job.countDocuments(), Application.countDocuments(),
      Department.countDocuments(), Student.countDocuments({ isPlaced: true }), Job.countDocuments({ status: 'active' }),
      Company.countDocuments({ isVerified: false })
    ]);
    const selectedApps = await Application.countDocuments({ status: 'selected' });
    const recentJobs = await Job.find().populate('company', 'name logo').sort('-createdAt').limit(5);
    const recentApplications = await Application.find().populate('user', 'name email').populate('job', 'title').sort('-appliedAt').limit(5);
    // Department-wise placement
    const departmentStats = await Student.aggregate([
      { $group: { _id: '$department', total: { $sum: 1 }, placed: { $sum: { $cond: ['$isPlaced', 1, 0] } }, avgCGPA: { $avg: '$cgpa' } } },
      { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'dept' } },
      { $unwind: '$dept' },
      { $project: { department: '$dept.name', code: '$dept.code', total: 1, placed: 1, avgCGPA: { $round: ['$avgCGPA', 2] }, placementRate: { $round: [{ $multiply: [{ $divide: ['$placed', { $max: ['$total', 1] }] }, 100] }, 1] } } }
    ]);
    // Monthly placement trend
    const monthlyStats = await Application.aggregate([
      { $match: { status: 'selected' } },
      { $group: { _id: { $month: '$updatedAt' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.status(200).json({ success: true, stats: { totalStudents, totalCompanies, totalJobs, totalApplications, totalDepartments, placedStudents, activeJobs, pendingCompanies, selectedApps }, departmentStats, monthlyStats, recentJobs, recentApplications });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Manage users (list, activate, deactivate)
// @route   GET /api/admin/users
export const getUsers = async (req, res) => {
  try {
    const { role, isActive, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    const total = await User.countDocuments(query);
    const users = await User.find(query).populate('department', 'name code').sort('-createdAt').skip((page - 1) * limit).limit(Number(limit));
    res.status(200).json({ success: true, total, totalPages: Math.ceil(total / limit), currentPage: Number(page), users });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id
export const updateUser = async (req, res) => {
  try {
    const { isActive, isApproved, role } = req.body;
    const updates = {};
    if (isActive !== undefined) updates.isActive = isActive;
    if (isApproved !== undefined) updates.isApproved = isApproved;
    if (role) updates.role = role;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, user });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Manage departments
// @route   POST /api/admin/departments
export const createDepartment = async (req, res) => {
  try {
    const dept = await Department.create(req.body);
    res.status(201).json({ success: true, department: dept });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @route   GET /api/admin/departments
export const getDepartments = async (req, res) => {
  try {
    const depts = await Department.find().populate('coordinator', 'name email').sort('name');
    res.status(200).json({ success: true, departments: depts });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @route   PUT /api/admin/departments/:id
export const updateDepartment = async (req, res) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!dept) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, department: dept });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Manage companies
// @route   GET /api/admin/companies
export const getCompanies = async (req, res) => {
  try {
    const { isVerified, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (isVerified !== undefined) query.isVerified = isVerified === 'true';
    if (search) query.name = { $regex: search, $options: 'i' };
    const total = await Company.countDocuments(query);
    const companies = await Company.find(query).sort('-createdAt').skip((page - 1) * limit).limit(Number(limit));
    res.status(200).json({ success: true, total, totalPages: Math.ceil(total / limit), companies });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @route   PUT /api/admin/companies/:id/verify
export const verifyCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
    if (!company) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Company verified', company });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Placement drives CRUD
// @route   POST /api/admin/placement-drives
export const createPlacementDrive = async (req, res) => {
  try {
    const drive = await PlacementDrive.create({ ...req.body, coordinatedBy: req.user.id });
    res.status(201).json({ success: true, drive });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @route   GET /api/admin/placement-drives
export const getPlacementDrives = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;
    const total = await PlacementDrive.countDocuments(query);
    const drives = await PlacementDrive.find(query).populate('company', 'name logo').populate('eligibleDepartments', 'name code').sort('-date').skip((page - 1) * limit).limit(Number(limit));
    res.status(200).json({ success: true, total, totalPages: Math.ceil(total / limit), drives });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Training programs
// @route   POST /api/admin/training-programs
export const createTrainingProgram = async (req, res) => {
  try {
    const program = await TrainingProgram.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, program });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @route   GET /api/admin/training-programs
export const getTrainingPrograms = async (req, res) => {
  try {
    const programs = await TrainingProgram.find().populate('departments', 'name code').sort('-startDate');
    res.status(200).json({ success: true, programs });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Send notification
// @route   POST /api/admin/notifications
export const sendNotification = async (req, res) => {
  try {
    const { recipients, type, title, message, link } = req.body;
    const notifications = recipients.map(r => ({ recipient: r, sender: req.user.id, type, title, message, link }));
    await Notification.insertMany(notifications);
    res.status(201).json({ success: true, message: 'Notifications sent' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Analytics data
// @route   GET /api/admin/analytics
export const getAnalytics = async (req, res) => {
  try {
    const packageStats = await Application.aggregate([
      { $match: { status: 'selected' } },
      { $lookup: { from: 'jobs', localField: 'job', foreignField: '_id', as: 'jobInfo' } },
      { $unwind: '$jobInfo' },
      { $group: { _id: null, highestPackage: { $max: '$jobInfo.package.max' }, avgPackage: { $avg: '$jobInfo.package.max' }, totalPlaced: { $sum: 1 } } }
    ]);
    const companyHiring = await Application.aggregate([
      { $match: { status: 'selected' } },
      { $lookup: { from: 'jobs', localField: 'job', foreignField: '_id', as: 'jobInfo' } },
      { $unwind: '$jobInfo' },
      { $lookup: { from: 'companies', localField: 'jobInfo.company', foreignField: '_id', as: 'companyInfo' } },
      { $unwind: '$companyInfo' },
      { $group: { _id: '$companyInfo.name', hires: { $sum: 1 } } },
      { $sort: { hires: -1 } }, { $limit: 10 }
    ]);
    res.status(200).json({ success: true, packageStats: packageStats[0] || {}, companyHiring });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
