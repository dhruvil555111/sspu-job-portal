import mongoose from 'mongoose';

/**
 * PlacementDrive Model - Campus recruitment drives
 * Manages scheduled placement drives with company details
 */
const placementDriveSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Drive title is required'],
    trim: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Drive date is required'],
  },
  endDate: Date,
  venue: {
    type: String,
    trim: true,
  },
  eligibleDepartments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  }],
  minCGPA: {
    type: Number,
    default: 0,
  },
  passingYears: [Number],
  jobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
  }],
  registeredStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  rounds: [{
    name: String,
    type: { type: String },
    date: Date,
    description: String,
  }],
  results: {
    totalRegistered: { type: Number, default: 0 },
    totalShortlisted: { type: Number, default: 0 },
    totalSelected: { type: Number, default: 0 },
    highestPackage: { type: Number, default: 0 },
    averagePackage: { type: Number, default: 0 },
  },
  coordinatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  instructions: String,
}, {
  timestamps: true,
});

placementDriveSchema.index({ date: 1, status: 1 });
placementDriveSchema.index({ company: 1 });

const PlacementDrive = mongoose.model('PlacementDrive', placementDriveSchema);
export default PlacementDrive;
