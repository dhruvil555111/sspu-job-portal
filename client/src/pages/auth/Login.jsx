import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { publicAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      const routes = { student: '/student/dashboard', alumni: '/student/dashboard', recruiter: '/recruiter/dashboard', tpo: '/admin/dashboard', coordinator: '/admin/dashboard', superadmin: '/admin/dashboard' };
      navigate(routes[user.role] || '/');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(formData);
      toast.success(data.message || 'Login successful!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark-50 dark:bg-dark-950 py-24 px-4">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10">
        <div className="bg-white dark:bg-dark-800 rounded-3xl shadow-2xl border border-dark-100 dark:border-dark-700 p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/25">
              <span className="text-white font-bold text-xl font-display">SSPU</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white">Welcome Back</h1>
            <p className="text-dark-500 mt-2 text-sm">Sign in to your SSPU Career Connect account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-2">Email Address</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field pl-12" placeholder="your@email.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-2">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pl-12 pr-12" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600">
                  {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-dark-500">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Forgot Password?</Link>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]">
              {loading ? (<span className="flex items-center justify-center gap-2"><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Signing in...</span>) : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-500 text-sm">Don't have an account? <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">Register</Link></p>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-dark-50 dark:bg-dark-700 rounded-xl">
            <p className="text-xs font-semibold text-dark-500 mb-2 text-center">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-dark-600 dark:text-dark-300">
              <button onClick={() => setFormData({ email: 'admin@sspu.edu.in', password: 'admin123' })} className="p-2 bg-white dark:bg-dark-600 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-center">Super Admin</button>
              <button onClick={() => setFormData({ email: 'tpo@sspu.edu.in', password: 'tpo123' })} className="p-2 bg-white dark:bg-dark-600 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-center">TPO</button>
              <button onClick={() => setFormData({ email: 'student@sspu.edu.in', password: 'student123' })} className="p-2 bg-white dark:bg-dark-600 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-center">Student</button>
              <button onClick={() => setFormData({ email: 'recruiter@company.com', password: 'recruiter123' })} className="p-2 bg-white dark:bg-dark-600 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-center">Recruiter</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
