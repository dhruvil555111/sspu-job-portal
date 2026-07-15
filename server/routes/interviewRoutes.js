import express from 'express';
import { scheduleInterview, getStudentInterviews, getRecruiterInterviews, getAllInterviews, updateInterview } from '../controllers/interviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('recruiter'), scheduleInterview);
router.get('/student', protect, authorize('student', 'alumni'), getStudentInterviews);
router.get('/recruiter', protect, authorize('recruiter'), getRecruiterInterviews);
router.get('/', protect, authorize('tpo', 'superadmin', 'coordinator'), getAllInterviews);
router.put('/:id', protect, authorize('recruiter', 'tpo', 'superadmin'), updateInterview);

export default router;
