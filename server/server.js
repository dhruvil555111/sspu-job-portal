import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import { seedDepartments } from './utils/seedData.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import recruiterRoutes from './routes/recruiterRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to Database
connectDB();

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'SSPU Career Connect API is running', timestamp: new Date() });
});

// Public departments route
app.get('/api/departments', async (req, res) => {
  try {
    const { default: Department } = await import('./models/Department.js');
    const departments = await Department.find({ isActive: true }).sort('name');
    res.status(200).json({ success: true, departments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Public stats route for homepage
app.get('/api/stats', async (req, res) => {
  try {
    const { default: Student } = await import('./models/Student.js');
    const { default: Company } = await import('./models/Company.js');
    const { default: Job } = await import('./models/Job.js');
    const { default: Application } = await import('./models/Application.js');
    const [totalStudents, totalCompanies, activeJobs, placed] = await Promise.all([
      Student.countDocuments(), Company.countDocuments({ isVerified: true }),
      Job.countDocuments({ status: 'active' }), Student.countDocuments({ isPlaced: true })
    ]);
    res.status(200).json({ success: true, stats: { totalStudents, totalCompanies, activeJobs, studentsPlaced: placed, highestPackage: 45, averagePackage: 8.5 } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Public companies route
app.get('/api/companies', async (req, res) => {
  try {
    const { default: Company } = await import('./models/Company.js');
    const companies = await Company.find({ isVerified: true, isActive: true }).sort('name');
    res.status(200).json({ success: true, companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Error handler
app.use(errorHandler);

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Seed initial data
seedDepartments();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SSPU Career Connect Server running on port ${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
