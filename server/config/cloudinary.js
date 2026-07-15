import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

/**
 * Cloudinary configuration for file uploads
 * Supports resume PDFs, profile images, and company logos
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for profile images
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'lj-career-connect/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

// Storage for resumes
const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'lj-career-connect/resumes',
    allowed_formats: ['pdf'],
    resource_type: 'raw',
  },
});

// Storage for company logos
const logoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'lj-career-connect/logos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
    transformation: [{ width: 300, height: 300, crop: 'limit' }],
  },
});

export const uploadImage = multer({ storage: imageStorage });
export const uploadResume = multer({ storage: resumeStorage });
export const uploadLogo = multer({ storage: logoStorage });
export { cloudinary };
