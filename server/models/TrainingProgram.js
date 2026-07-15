import mongoose from 'mongoose';

/**
 * TrainingProgram Model - Training and skill development programs
 */
const trainingProgramSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Program title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  trainer: {
    name: String,
    designation: String,
    organization: String,
  },
  type: {
    type: String,
    enum: ['workshop', 'seminar', 'bootcamp', 'certification', 'webinar', 'course'],
    default: 'workshop',
  },
  departments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  }],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: Date,
  duration: String,
  venue: String,
  mode: {
    type: String,
    enum: ['online', 'offline', 'hybrid'],
    default: 'offline',
  },
  maxParticipants: Number,
  registeredStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  }],
  skills: [String],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  banner: {
    url: String,
    publicId: String,
  },
}, {
  timestamps: true,
});

const TrainingProgram = mongoose.model('TrainingProgram', trainingProgramSchema);
export default TrainingProgram;
