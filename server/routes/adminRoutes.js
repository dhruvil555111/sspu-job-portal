import express from 'express';
import { getDashboard, getUsers, updateUser, createDepartment, getDepartments, updateDepartment, getCompanies, verifyCompany, createPlacementDrive, getPlacementDrives, createTrainingProgram, getTrainingPrograms, sendNotification, getAnalytics } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();
const adminAuth = [protect, authorize('tpo', 'superadmin')];
const superAuth = [protect, authorize('superadmin')];

router.get('/dashboard', ...adminAuth, getDashboard);
router.get('/analytics', ...adminAuth, getAnalytics);
router.route('/users').get(...adminAuth, getUsers);
router.route('/users/:id').put(...adminAuth, updateUser);
router.route('/departments').get(...adminAuth, getDepartments).post(...superAuth, createDepartment);
router.route('/departments/:id').put(...superAuth, updateDepartment);
router.route('/companies').get(...adminAuth, getCompanies);
router.put('/companies/:id/verify', ...adminAuth, verifyCompany);
router.route('/placement-drives').get(...adminAuth, getPlacementDrives).post(...adminAuth, createPlacementDrive);
router.route('/training-programs').get(...adminAuth, getTrainingPrograms).post(...adminAuth, createTrainingProgram);
router.post('/notifications', ...adminAuth, sendNotification);

export default router;
