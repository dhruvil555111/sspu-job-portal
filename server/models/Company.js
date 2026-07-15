import mongoose from 'mongoose';

/**
 * Company Model - Registered companies/recruiters
 * Manages company profiles and verification status
 */
const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Company email is required'],
    trim: true,
    lowercase: true,
  },
  website: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  industry: {
    type: String,
    trim: true,
  },
  companySize: {
    type: String,
    enum: ['1-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+'],
  },
  logo: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
  },
  location: {
    city: String,
    state: String,
    country: { type: String, default: 'India' },
  },
  contactPerson: {
    name: String,
    email: String,
    phone: String,
    designation: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  recruiters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  totalHires: {
    type: Number,
    default: 0,
  },
  averagePackage: {
    type: Number,
    default: 0,
  },
  highestPackage: {
    type: Number,
    default: 0,
  },
  establishedYear: Number,
  socialLinks: {
    linkedin: String,
    twitter: String,
    facebook: String,
  },
}, {
  timestamps: true,
});

companySchema.index({ name: 'text', industry: 'text' });
companySchema.index({ isVerified: 1, isActive: 1 });

const Company = mongoose.model('Company', companySchema);
export default Company;
