import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { publicAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineUser, HiOutlinePhone, HiOutlineAcademicCap } from 'react-icons/hi';

const Register = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: searchParams.get('role') || 'student', phone: '',
    department: '', passingYear: new Date().getFullYear() + 1, program: '',
  });
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await publicAPI.getDepartments();
        setDepartments(data.departments || []);
      } catch { /* departments will load from seed */ }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match'); return;
    }
    setLoading(true);
    try {
      const data = await register(formData);
      toast.success(data.message || 'Registration successful!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const roles = [
    { value: 'student', label: 'Student', icon: '🎓', desc: 'Apply for jobs and internships' },
    { value: 'recruiter', label: 'Recruiter', icon: '🏢', desc: 'Post jobs and hire talent' },
    { value: 'alumni', label: 'Alumni', icon: '🎉', desc: 'Stay connected and mentor' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark-50 dark:bg-dark-950 py-24 px-4">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg relative z-10">
        <div className="bg-white dark:bg-dark-800 rounded-3xl shadow-2xl border border-dark-100 dark:border-dark-700 p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/25">
              <span className="text-white font-bold text-2xl font-display">LJ</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white">Create Account</h1>
            <p className="text-dark-500 mt-2 text-sm">Join LJ Career Connect today</p>
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2].map(s => (
              <div key={s} className={`h-2 rounded-full transition-all duration-300 ${step >= s ? 'w-12 bg-primary-500' : 'w-8 bg-dark-200 dark:bg-dark-600'}`} />
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <p className="text-sm font-semibold text-dark-700 dark:text-dark-200 mb-3">I am a:</p>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {roles.map(r => (
                    <button type="button" key={r.value} onClick={() => setFormData({ ...formData, role: r.value })}
                      className={`p-4 rounded-xl border-2 text-center transition-all duration-300 ${formData.role === r.value ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-dark-200 dark:border-dark-600 hover:border-primary-300'}`}>
                      <span className="text-2xl block mb-1">{r.icon}</span>
                      <span className="text-xs font-semibold text-dark-700 dark:text-dark-200">{r.label}</span>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-1.5">Full Name</label>
                  <div className="relative">
                    <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input-field pl-12" placeholder="Your full name" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-1.5">Email</label>
                  <div className="relative">
                    <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="input-field pl-12" placeholder="your@email.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-1.5">Phone</label>
                  <div className="relative">
                    <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="input-field pl-12" placeholder="+91 9876543210" />
                  </div>
                </div>

                <button type="button" onClick={() => setStep(2)}
                  className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">Continue</button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                {(formData.role === 'student' || formData.role === 'alumni') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-1.5">Department</label>
                      <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="input-field" required>
                        <option value="">Select Department</option>
                        {departments.map(d => (<option key={d._id} value={d._id}>{d.name}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-1.5">Passing Year</label>
                      <input type="number" required value={formData.passingYear} onChange={e => setFormData({ ...formData, passingYear: e.target.value })} className="input-field" min="2020" max="2030" />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-1.5">Password</label>
                  <div className="relative">
                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input type={showPassword ? 'text' : 'password'} required minLength={6} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="input-field pl-12 pr-12" placeholder="Min 6 characters" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400">
                      {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input type="password" required value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} className="input-field pl-12" placeholder="Confirm password" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 py-3.5 border-2 border-dark-200 dark:border-dark-600 text-dark-700 dark:text-dark-200 font-semibold rounded-xl hover:bg-dark-50 dark:hover:bg-dark-700 transition-all">Back</button>
                  <button type="submit" disabled={loading} className="flex-1 py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60">
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </motion.div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-500 text-sm">Already have an account? <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign In</Link></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
