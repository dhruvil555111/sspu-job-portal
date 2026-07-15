import express from 'express';
import { registerCompany, getMyCompany, updateCompany, getApplications, updateApplicationStatus, getDashboard } from '../controllers/recruiterController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, authorize('recruiter'), getDashboard);
router.route('/company').get(protect, authorize('recruiter'), getMyCompany).post(protect, authorize('recruiter'), registerCompany);
router.put('/company/:id', protect, authorize('recruiter'), updateCompany);
router.get('/applications', protect, authorize('recruiter'), getApplications);
router.put('/applications/:id', protect, authorize('recruiter'), updateApplicationStatus);

export default router;
