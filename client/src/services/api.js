import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

// Response interceptor - handle auth errors
api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (window.location.pathname !== '/login') window.location.href = '/login';
  }
  return Promise.reject(error);
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  resendOTP: () => api.post('/auth/resend-otp'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  updatePassword: (data) => api.put('/auth/update-password', data),
};

// Job API
export const jobAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  getFeatured: () => api.get('/jobs/featured'),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
  approve: (id) => api.put(`/jobs/${id}/approve`),
};

// Student API
export const studentAPI = {
  getProfile: () => api.get('/students/profile'),
  updateProfile: (data) => api.put('/students/profile', data),
  apply: (jobId, data) => api.post(`/students/apply/${jobId}`, data),
  getApplications: (params) => api.get('/students/applications', { params }),
  toggleSaveJob: (jobId) => api.put(`/students/save-job/${jobId}`),
  getSavedJobs: () => api.get('/students/saved-jobs'),
  getPlacementDrives: () => api.get('/students/placement-drives'),
  registerPlacementDrive: (id) => api.post(`/students/placement-drives/${id}/register`),
  getTrainingPrograms: () => api.get('/students/training-programs'),
  registerTrainingProgram: (id) => api.post(`/students/training-programs/${id}/register`),
  getAll: (params) => api.get('/students', { params }),
};

// Recruiter API
export const recruiterAPI = {
  getDashboard: () => api.get('/recruiter/dashboard'),
  registerCompany: (data) => api.post('/recruiter/company', data),
  getCompany: () => api.get('/recruiter/company'),
  updateCompany: (id, data) => api.put(`/recruiter/company/${id}`, data),
  getApplications: (params) => api.get('/recruiter/applications', { params }),
  updateApplicationStatus: (id, data) => api.put(`/recruiter/applications/${id}`, data),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAnalytics: () => api.get('/admin/analytics'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  getDepartments: () => api.get('/admin/departments'),
  createDepartment: (data) => api.post('/admin/departments', data),
  updateDepartment: (id, data) => api.put(`/admin/departments/${id}`, data),
  getCompanies: (params) => api.get('/admin/companies', { params }),
  verifyCompany: (id) => api.put(`/admin/companies/${id}/verify`),
  getPlacementDrives: (params) => api.get('/admin/placement-drives', { params }),
  createPlacementDrive: (data) => api.post('/admin/placement-drives', data),
  getTrainingPrograms: () => api.get('/admin/training-programs'),
  createTrainingProgram: (data) => api.post('/admin/training-programs', data),
  sendNotification: (data) => api.post('/admin/notifications', data),
};

// Public API
export const publicAPI = {
  getDepartments: () => api.get('/departments'),
  getStats: () => api.get('/stats'),
  getCompanies: () => api.get('/companies'),
};

// Interview API
export const interviewAPI = {
  schedule: (data) => api.post('/interviews', data),
  getStudentInterviews: () => api.get('/interviews/student'),
  getRecruiterInterviews: () => api.get('/interviews/recruiter'),
  getAll: () => api.get('/interviews'),
  update: (id, data) => api.put(`/interviews/${id}`, data),
};

// AI API
export const aiAPI = {
  analyzeResume: () => api.post('/ai/analyze-resume'),
  getRecommendations: () => api.get('/ai/job-recommendations'),
};

// Report API
export const reportAPI = {
  downloadPlacementsUrl: () => `${API_URL}/reports/placements`,
};

export default api;
