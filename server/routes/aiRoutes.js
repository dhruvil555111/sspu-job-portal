import express from 'express';
import { analyzeResume, getJobRecommendations } from '../controllers/aiController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/analyze-resume', protect, authorize('student', 'alumni'), analyzeResume);
router.get('/job-recommendations', protect, authorize('student', 'alumni'), getJobRecommendations);

export default router;
