import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineMail, HiOutlineShieldCheck, HiOutlineRefresh } from 'react-icons/hi';
import toast from 'react-hot-toast';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { user, loadUser } = useAuth();
  const navigate = useNavigate();

  // If user is already verified, redirect them to dashboard
  useEffect(() => {
    if (user && user.isVerified) {
      navigate(getDashboardLink(user.role));
    }
  }, [user, navigate]);

  // Handle resend countdown timer
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const getDashboardLink = (role) => {
    const routes = {
      student: '/student/dashboard',
      alumni: '/student/dashboard',
      recruiter: '/recruiter/dashboard',
      tpo: '/admin/dashboard',
      coordinator: '/admin/dashboard',
      superadmin: '/admin/dashboard'
    };
    return routes[role] || '/';
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      return toast.error('OTP must be exactly 6 digits');
    }

    setLoading(true);
    try {
      const { data } = await authAPI.verifyOTP({ otp });
      if (data.success) {
        toast.success('Email verified successfully!');
        // Reload user info to update authentication state
        await loadUser();
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setLoading(true);
    try {
      const { data } = await authAPI.resendOTP();
      if (data.success) {
        toast.success('A new OTP has been sent to your email.');
        setTimer(60);
        setCanResend(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
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
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/20 animate-bounce">
          <HiOutlineShieldCheck className="w-9 h-9 text-white" />
        </div>

        <h1 className="text-2xl font-display font-extrabold text-dark-900 dark:text-white mb-2">Verify Your Email</h1>
        <p className="text-xs text-dark-500 leading-relaxed mb-6 max-w-sm mx-auto">
          We have sent a 6-digit One-Time Password (OTP) to your registered email address <span className="font-bold text-dark-900 dark:text-white">{user?.email}</span>.
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="text-xs font-semibold text-dark-500 block mb-2 text-left">Enter 6-Digit OTP</label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 123456"
              className="w-full text-center text-2xl font-extrabold tracking-widest py-3 rounded-2xl border border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-dark-900 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full btn-primary py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
          >
            {loading ? 'Verifying OTP...' : 'Verify & Activate'}
          </button>
        </form>

        <div className="mt-8 border-t border-dark-100 dark:border-dark-800 pt-6">
          <p className="text-xs text-dark-500">
            Didn't receive the email?{' '}
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={loading}
                className="text-primary-500 font-bold hover:underline inline-flex items-center gap-1"
              >
                <HiOutlineRefresh className="w-3.5 h-3.5" /> Resend OTP
              </button>
            ) : (
              <span className="text-dark-400 font-semibold">Resend OTP in {timer}s</span>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
