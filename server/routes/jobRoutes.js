import express from 'express';
import { createJob, getJobs, getJob, updateJob, deleteJob, approveJob, getFeaturedJobs } from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/featured', getFeaturedJobs);
router.route('/').get(getJobs).post(protect, authorize('recruiter', 'tpo', 'superadmin'), createJob);
router.route('/:id').get(getJob).put(protect, authorize('recruiter', 'tpo', 'superadmin'), updateJob).delete(protect, authorize('recruiter', 'tpo', 'superadmin'), deleteJob);
router.put('/:id/approve', protect, authorize('tpo', 'superadmin'), approveJob);

export default router;
