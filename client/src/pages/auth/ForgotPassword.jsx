import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../../services/api';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineShieldCheck, HiOutlineArrowLeft, HiOutlineKey } from 'react-icons/hi';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Request, 2: Reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email address');

    setLoading(true);
    try {
      const { data } = await authAPI.forgotPassword({ email });
      if (data.success) {
        toast.success(data.message || 'OTP sent successfully!');
        setStep(2);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send recovery OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error('Please enter the OTP');
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');

    setLoading(true);
    try {
      const { data } = await authAPI.resetPassword({ email, otp, newPassword });
      if (data.success) {
        toast.success('Password updated successfully! Please login.');
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-50 dark:bg-dark-950 px-4 sm:px-6 lg:px-8 py-20">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-650/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 text-center"
      >
        <Link to="/login" className="absolute top-6 left-6 text-dark-400 hover:text-primary-500 transition-colors flex items-center gap-1 text-xs font-semibold">
          <HiOutlineArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center mx-auto mb-6 shadow-lg mt-4">
          <HiOutlineKey className="w-9 h-9 text-white" />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl font-display font-extrabold text-dark-900 dark:text-white mb-2">Recover Password</h1>
              <p className="text-xs text-dark-500 leading-relaxed mb-6 max-w-sm mx-auto">
                Enter your registered email address below. We will send a secure verification code to reset your account credentials.
              </p>

              <form onSubmit={handleRequestOTP} className="space-y-5 text-left">
                <div>
                  <label className="text-xs font-semibold text-dark-500 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@sspu.edu.in"
                    className="w-full px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
                >
                  {loading ? 'Sending Request...' : 'Send Recovery OTP'}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl font-display font-extrabold text-dark-900 dark:text-white mb-2">Create New Password</h1>
              <p className="text-xs text-dark-500 leading-relaxed mb-6 max-w-sm mx-auto">
                Please enter the 6-digit recovery code sent to your email along with your desired new password.
              </p>

              <form onSubmit={handleResetPassword} className="space-y-4 text-left">
                <div>
                  <label className="text-xs font-semibold text-dark-500 block mb-1">Verification OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-semibold tracking-wider text-center"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-dark-500 block mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-dark-500 block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? 'Updating Credentials...' : 'Reset & Save Password'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
