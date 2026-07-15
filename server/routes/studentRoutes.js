import express from 'express';
import { getProfile, updateProfile, applyForJob, getMyApplications, toggleSaveJob, getSavedJobs, getStudents, getPlacementDrivesForStudents, registerForPlacementDrive, getTrainingProgramsForStudents, registerForTrainingProgram } from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', protect, authorize('student', 'alumni'), getProfile);
router.put('/profile', protect, authorize('student', 'alumni'), updateProfile);
router.post('/apply/:jobId', protect, authorize('student'), applyForJob);
router.get('/applications', protect, authorize('student', 'alumni'), getMyApplications);
router.put('/save-job/:jobId', protect, authorize('student'), toggleSaveJob);
router.get('/saved-jobs', protect, authorize('student'), getSavedJobs);
router.get('/placement-drives', protect, authorize('student', 'alumni'), getPlacementDrivesForStudents);
router.post('/placement-drives/:id/register', protect, authorize('student'), registerForPlacementDrive);
router.get('/training-programs', protect, authorize('student', 'alumni'), getTrainingProgramsForStudents);
router.post('/training-programs/:id/register', protect, authorize('student'), registerForTrainingProgram);
router.get('/', protect, authorize('recruiter', 'tpo', 'coordinator', 'superadmin'), getStudents);

export default router;
