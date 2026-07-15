import mongoose from 'mongoose';

/**
 * Department Model - Dynamic department management
 * Supports all LJ University departments and future additions
 */
const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
    trim: true,
  },
  code: {
    type: String,
    required: [true, 'Department code is required'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  programs: [{
    type: String,
    trim: true,
  }],
  coordinator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  hodName: {
    type: String,
    trim: true,
  },
  hodEmail: {
    type: String,
    trim: true,
  },
  totalStudents: {
    type: Number,
    default: 0,
  },
  placedStudents: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  icon: {
    type: String,
    default: '🎓',
  },
}, {
  timestamps: true,
});

departmentSchema.index({ code: 1 });
departmentSchema.index({ isActive: 1 });

const Department = mongoose.model('Department', departmentSchema);
export default Department;
