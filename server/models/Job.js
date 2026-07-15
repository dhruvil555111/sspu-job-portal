import mongoose from 'mongoose';

/**
 * Job Model - Job and internship postings
 * Supports full-time, internship, remote, and hybrid positions
 */
const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company is required'],
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
  },
  requirements: {
    type: String,
  },
  responsibilities: {
    type: String,
  },
  jobType: {
    type: String,
    enum: ['full-time', 'internship', 'part-time', 'contract'],
    required: [true, 'Job type is required'],
  },
  workMode: {
    type: String,
    enum: ['onsite', 'remote', 'hybrid'],
    default: 'onsite',
  },
  location: {
    type: String,
    trim: true,
  },
  package: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    period: { type: String, enum: ['yearly', 'monthly', 'stipend'], default: 'yearly' },
  },
  experience: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
  },
  eligibility: {
    departments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    }],
    minCGPA: { type: Number, default: 0 },
    passingYears: [Number],
    skills: [String],
    backlogsAllowed: { type: Boolean, default: false },
  },
  requiredSkills: [{
    type: String,
    trim: true,
  }],
  vacancies: {
    type: Number,
    default: 1,
  },
  deadline: {
    type: Date,
    required: [true, 'Application deadline is required'],
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'closed', 'expired', 'filled'],
    default: 'active',
  },
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
  }],
  totalApplications: {
    type: Number,
    default: 0,
  },
  isApprovedByTPO: {
    type: Boolean,
    default: false,
  },
  placementDrive: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlacementDrive',
  },
  selectionProcess: [{
    round: Number,
    type: { type: String },
    description: String,
  }],
  perks: [String],
  tags: [String],
}, {
  timestamps: true,
});

// Indexes for efficient searching
jobSchema.index({ title: 'text', description: 'text', requiredSkills: 'text' });
jobSchema.index({ status: 1, deadline: 1 });
jobSchema.index({ company: 1 });
jobSchema.index({ 'eligibility.departments': 1 });
jobSchema.index({ jobType: 1, workMode: 1 });
jobSchema.index({ createdAt: -1 });

const Job = mongoose.model('Job', jobSchema);
export default Job;
