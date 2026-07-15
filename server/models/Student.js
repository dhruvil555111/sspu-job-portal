import mongoose from 'mongoose';

/**
 * Student Model - Extended student profile
 * Linked to User model for authentication
 */
const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  enrollmentNo: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Department is required'],
  },
  program: {
    type: String,
    trim: true,
  },
  semester: {
    type: Number,
    min: 1,
    max: 10,
  },
  passingYear: {
    type: Number,
    required: [true, 'Passing year is required'],
  },
  cgpa: {
    type: Number,
    min: 0,
    max: 10,
  },
  tenthPercentage: {
    type: Number,
    min: 0,
    max: 100,
  },
  twelfthPercentage: {
    type: Number,
    min: 0,
    max: 100,
  },
  diplomaPercentage: {
    type: Number,
    min: 0,
    max: 100,
  },
  skills: [{
    type: String,
    trim: true,
  }],
  resume: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
  },
  projects: [{
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    technologies: [String],
    link: { type: String, trim: true },
    github: { type: String, trim: true },
  }],
  certificates: [{
    title: { type: String, trim: true },
    issuer: { type: String, trim: true },
    date: Date,
    link: { type: String, trim: true },
  }],
  experience: [{
    title: { type: String, trim: true },
    company: { type: String, trim: true },
    duration: { type: String, trim: true },
    description: { type: String, trim: true },
  }],
  portfolio: {
    type: String,
    trim: true,
  },
  github: {
    type: String,
    trim: true,
  },
  linkedin: {
    type: String,
    trim: true,
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  address: {
    city: String,
    state: String,
    pincode: String,
  },
  isPlaced: {
    type: Boolean,
    default: false,
  },
  placedAt: {
    company: String,
    package: Number,
    date: Date,
  },
  isProfileComplete: {
    type: Boolean,
    default: false,
  },
  isApprovedByCoordinator: {
    type: Boolean,
    default: false,
  },
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
  }],
}, {
  timestamps: true,
});

// Indexes for search and filter
studentSchema.index({ department: 1, passingYear: 1 });
studentSchema.index({ skills: 1 });
studentSchema.index({ cgpa: -1 });
studentSchema.index({ isPlaced: 1 });
studentSchema.index({ user: 1 });

const Student = mongoose.model('Student', studentSchema);
export default Student;
