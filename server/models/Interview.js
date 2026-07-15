import mongoose from 'mongoose';

/**
 * Interview Model - Schedule tracking for recruiter-student rounds
 */
const interviewSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Interview title/round is required'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Interview date is required'],
  },
  time: {
    type: String,
    required: [true, 'Interview time is required'],
  },
  mode: {
    type: String,
    enum: ['online', 'offline'],
    default: 'online',
  },
  link: {
    type: String,
    trim: true,
  },
  venue: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled',
  },
  interviewer: {
    type: String,
    trim: true,
  },
  feedback: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

interviewSchema.index({ student: 1, date: 1 });
interviewSchema.index({ company: 1, date: 1 });

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
