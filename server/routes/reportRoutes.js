import express from 'express';
import { getPlacementReport } from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/placements', protect, authorize('tpo', 'superadmin'), getPlacementReport);

export default router;
