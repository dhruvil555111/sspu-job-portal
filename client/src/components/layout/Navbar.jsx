import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { HiOutlineMenu, HiOutlineX, HiOutlineSun, HiOutlineMoon, HiOutlineBell, HiOutlineUser, HiOutlineLogout, HiOutlineChevronDown, HiOutlineBriefcase, HiOutlineAcademicCap, HiOutlineOfficeBuilding, HiOutlineHome, HiOutlineMail, HiOutlineTrendingUp, HiOutlineCalendar } from 'react-icons/hi';
import { HiOutlineSparkles } from 'react-icons/hi2';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); setProfileOpen(false); }, [location]);

  const handleLogout = async () => { await logout(); navigate('/'); };

  const getDashboardLink = () => {
    if (!user) return '/login';
    const routes = { student: '/student/dashboard', alumni: '/student/dashboard', recruiter: '/recruiter/dashboard', tpo: '/admin/dashboard', coordinator: '/admin/dashboard', superadmin: '/admin/dashboard' };
    return routes[user.role] || '/';
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <HiOutlineHome /> },
    { name: 'Jobs', path: '/jobs', icon: <HiOutlineBriefcase className="w-4 h-4" /> },
    { name: 'Companies', path: '/companies', icon: <HiOutlineOfficeBuilding className="w-4 h-4" /> },
    { name: 'Candidates', path: '/candidates', icon: <HiOutlineUser className="w-4 h-4" /> },
    { name: 'About', path: '/about', icon: <HiOutlineUser className="w-4 h-4" /> },
    { name: 'Contact', path: '/contact', icon: <HiOutlineMail className="w-4 h-4" /> },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-2.5' : 'py-4'} ${scrolled ? (darkMode ? 'bg-dark-900/80 backdrop-blur-xl border-b border-dark-800/80 shadow-2xl shadow-dark-950/40' : 'bg-white/80 backdrop-blur-xl border-b border-dark-100/80 shadow-md') : (location.pathname === '/' ? 'bg-transparent' : (darkMode ? 'bg-dark-900/40 backdrop-blur-md' : 'bg-white/40 backdrop-blur-md'))}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img src={logo} alt="SSPU Logo" className="w-10 h-10 rounded-xl object-contain bg-white p-0.5 border border-dark-200/50 shadow-md group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-success-500 rounded-full border-2 border-white dark:border-dark-900 animate-pulse" />
            </div>
            <div className="hidden sm:block text-left">
              <h1 className={`font-display font-bold text-base leading-tight ${scrolled ? (darkMode ? 'text-white' : 'text-dark-900') : (location.pathname === '/' ? 'text-white' : (darkMode ? 'text-white' : 'text-dark-900'))}`}>Career Connect</h1>
              <p className={`text-[9px] font-extrabold tracking-wider uppercase ${scrolled ? (darkMode ? 'text-accent-400' : 'text-primary-700') : (location.pathname === '/' ? 'text-accent-400' : (darkMode ? 'text-accent-400' : 'text-primary-700'))}`}>Shree Saurashtra Patel University</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${location.pathname === link.path
                  ? (scrolled ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25' : 'bg-white/20 text-white')
                  : (scrolled ? (darkMode ? 'text-dark-300 hover:text-white hover:bg-dark-700' : 'text-dark-600 hover:text-dark-900 hover:bg-dark-100') : 'text-white/80 hover:text-white hover:bg-white/10')
                }`}>
                {link.icon}{link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button onClick={toggleTheme} className={`p-2.5 rounded-xl transition-all duration-300 ${scrolled ? (darkMode ? 'text-dark-300 hover:bg-dark-700 hover:text-yellow-400' : 'text-dark-500 hover:bg-dark-100 hover:text-primary-600') : 'text-white/80 hover:bg-white/10 hover:text-yellow-400'}`}>
              {darkMode ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button className={`p-2.5 rounded-xl relative transition-all duration-300 ${scrolled ? (darkMode ? 'text-dark-300 hover:bg-dark-700' : 'text-dark-500 hover:bg-dark-100') : 'text-white/80 hover:bg-white/10'}`}>
                  <HiOutlineBell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full" />
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)} className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-all duration-300 ${scrolled ? (darkMode ? 'hover:bg-dark-700' : 'hover:bg-dark-100') : 'hover:bg-white/10'}`}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{user?.name?.charAt(0)?.toUpperCase()}</span>
                    </div>
                    <span className={`hidden md:block text-sm font-medium ${scrolled ? (darkMode ? 'text-white' : 'text-dark-900') : 'text-white'}`}>{user?.name?.split(' ')[0]}</span>
                    <HiOutlineChevronDown className={`w-4 h-4 transition-transform ${profileOpen ? 'rotate-180' : ''} ${scrolled ? (darkMode ? 'text-dark-400' : 'text-dark-500') : 'text-white/60'}`} />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-dark-100 dark:border-dark-700 py-2 overflow-hidden">
                        <div className="px-4 py-3 border-b border-dark-100 dark:border-dark-700">
                          <p className="text-sm font-semibold text-dark-900 dark:text-white">{user?.name}</p>
                          <p className="text-xs text-dark-500 mt-0.5">{user?.email}</p>
                          <span className="inline-block mt-1.5 px-2 py-0.5 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-xs font-semibold rounded-full capitalize">{user?.role}</span>
                        </div>
                        <Link to={getDashboardLink()} className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-700 dark:text-dark-200 hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors">
                          <HiOutlineUser className="w-4 h-4" /> Dashboard
                        </Link>
                        {(user?.role === 'student' || user?.role === 'alumni') && (
                          <Link to="/student/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-700 dark:text-dark-200 hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors">
                            <HiOutlineUser className="w-4 h-4" /> Edit Profile
                          </Link>
                        )}
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <HiOutlineLogout className="w-4 h-4" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${scrolled ? (darkMode ? 'text-dark-300 hover:text-white hover:bg-dark-700' : 'text-dark-600 hover:text-dark-900 hover:bg-dark-100') : 'text-white/90 hover:text-white hover:bg-white/10'}`}>Login</Link>
                <Link to="/register" className="px-5 py-2 bg-gradient-to-r from-primary-600 to-accent-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 hover:scale-105">Register</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button onClick={() => setIsOpen(!isOpen)} className={`lg:hidden p-2.5 rounded-xl transition-all duration-300 ${scrolled ? (darkMode ? 'text-white hover:bg-dark-700' : 'text-dark-900 hover:bg-dark-100') : 'text-white hover:bg-white/10'}`}>
              {isOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
            className="lg:hidden bg-white dark:bg-dark-900 border-t border-dark-100 dark:border-dark-800 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${location.pathname === link.path ? 'bg-primary-600 text-white' : 'text-dark-700 dark:text-dark-200 hover:bg-dark-50 dark:hover:bg-dark-800'}`}>
                  {link.icon}{link.name}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-3 border-t border-dark-100 dark:border-dark-800 space-y-2">
                  <Link to="/login" className="block w-full text-center px-4 py-3 rounded-xl text-sm font-medium border-2 border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20">Login</Link>
                  <Link to="/register" className="block w-full text-center px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary-600 to-accent-500 text-white">Register</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
