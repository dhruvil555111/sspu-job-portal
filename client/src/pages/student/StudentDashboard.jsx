import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { studentAPI, interviewAPI, aiAPI } from '../../services/api';
import { HiOutlineBriefcase, HiOutlineDocumentText, HiOutlineBookmark, HiOutlineCalendar, HiOutlineUser, HiOutlineArrowRight, HiOutlineCheckCircle, HiOutlineClock, HiOutlineDownload } from 'react-icons/hi';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ applied: 0, shortlisted: 0, interviews: 0, offers: 0, profileCompletion: 50 });
  const [recentApps, setRecentApps] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [appsRes, interviewsRes, aiRes] = await Promise.all([
          studentAPI.getApplications(),
          interviewAPI.getStudentInterviews(),
          aiAPI.analyzeResume().catch(() => ({ data: { score: 40 } }))
        ]);

        const apps = appsRes.data.applications || [];
        const interviews = interviewsRes.data.interviews || [];
        const score = aiRes.data?.score || 45;

        const appliedCount = apps.length;
        const shortlistedCount = apps.filter(a => a.status === 'shortlisted').length;
        const offersCount = apps.filter(a => ['selected', 'offer-letter'].includes(a.status)).length;
        const interviewsCount = interviews.length;

        setStats({
          applied: appliedCount,
          shortlisted: shortlistedCount,
          interviews: interviewsCount,
          offers: offersCount,
          profileCompletion: score,
        });

        setRecentApps(apps.slice(0, 5));
        setUpcomingInterviews(interviews.slice(0, 3));
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Applied Jobs', value: stats.applied, icon: <HiOutlineDocumentText className="w-6 h-6" />, color: 'from-blue-500 to-cyan-400' },
    { label: 'Shortlisted', value: stats.shortlisted, icon: <HiOutlineCheckCircle className="w-6 h-6" />, color: 'from-emerald-500 to-teal-400' },
    { label: 'Interviews Scheduled', value: stats.interviews, icon: <HiOutlineCalendar className="w-6 h-6" />, color: 'from-amber-500 to-orange-400' },
    { label: 'Offers Received', value: stats.offers, icon: <HiOutlineBriefcase className="w-6 h-6" />, color: 'from-purple-500 to-pink-400' },
  ];

  const statusConfig = {
    applied: { color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300', label: 'Applied' },
    shortlisted: { color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300', label: 'Shortlisted' },
    interview: { color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300', label: 'Interview' },
    selected: { color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300', label: 'Selected' },
    rejected: { color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300', label: 'Rejected' },
    withdrawn: { color: 'text-dark-500 bg-dark-100 dark:bg-dark-800 dark:text-dark-400', label: 'Withdrawn' },
    'offer-letter': { color: 'text-purple-650 bg-purple-150 dark:bg-purple-950 dark:text-purple-355', label: 'Offer Received' },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-50 dark:bg-dark-950 pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-dark-500">Loading student dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 pt-24 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-dark-900 dark:text-white">
            Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0] || 'Student'}</span> 👋
          </h1>
          <p className="text-xs text-dark-500 mt-1">Here's your real-time academic placement dashboard.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3 shadow-md`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-display font-bold text-dark-900 dark:text-white leading-none">{stat.value}</p>
              <p className="text-xs text-dark-400 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Applications & Interviews */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Applications List */}
            <div className="bg-white dark:bg-dark-900 rounded-3xl border border-dark-100 dark:border-dark-800 overflow-hidden shadow-sm">
              <div className="flex items-center justify-between p-5 border-b border-dark-100 dark:border-dark-800">
                <h2 className="font-display font-semibold text-dark-900 dark:text-white text-sm">Recent Application Logs</h2>
                <Link to="/jobs" className="text-xs text-primary-600 dark:text-primary-400 font-bold hover:underline flex items-center gap-1">
                  Browse Open Jobs <HiOutlineArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              
              {recentApps.length === 0 ? (
                <div className="p-8 text-center text-xs text-dark-400">
                  You haven't submitted any job applications yet.
                </div>
              ) : (
                <div className="divide-y divide-dark-50 dark:divide-dark-850">
                  {recentApps.map((app) => (
                    <div key={app._id} className="p-4 flex items-center justify-between hover:bg-dark-50/50 dark:hover:bg-dark-950/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
                          {app.job?.company?.name?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <p className="font-bold text-dark-900 dark:text-white text-xs leading-snug">{app.job?.title}</p>
                          <p className="text-[10px] text-dark-400 mt-0.5">{app.job?.company?.name} &bull; {app.job?.location} &bull; Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {app.offerLetter?.url && (
                          <a href={app.offerLetter.url} download target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-primary-100 text-primary-700 hover:bg-primary-600 hover:text-white transition-colors" title="Download Offer Letter">
                            <HiOutlineDownload className="w-4 h-4" />
                          </a>
                        )}
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${statusConfig[app.status]?.color || 'text-dark-500 bg-dark-100'}`}>
                          {statusConfig[app.status]?.label || app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Interviews */}
            <div className="bg-white dark:bg-dark-900 rounded-3xl border border-dark-100 dark:border-dark-800 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-dark-100 dark:border-dark-800">
                <h2 className="font-display font-semibold text-dark-900 dark:text-white text-sm">Upcoming Interview Timelines</h2>
              </div>
              {upcomingInterviews.length === 0 ? (
                <div className="p-8 text-center text-xs text-dark-400">
                  No upcoming interview rounds scheduled at the moment.
                </div>
              ) : (
                <div className="divide-y divide-dark-50 dark:divide-dark-850">
                  {upcomingInterviews.map((interview) => (
                    <div key={interview._id} className="p-4 hover:bg-dark-50/50 dark:hover:bg-dark-950/20 transition-colors flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <HiOutlineCalendar className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-dark-900 dark:text-white text-xs leading-snug">{interview.title}</p>
                          <p className="text-[10px] text-dark-500 font-medium">{interview.job?.title} &bull; {interview.company?.name}</p>
                          <p className="text-[10px] text-dark-400 mt-1 flex items-center gap-1 font-semibold">
                            <HiOutlineClock className="w-3.5 h-3.5" /> {new Date(interview.date).toLocaleDateString()} at {interview.time} ({interview.mode.toUpperCase()})
                          </p>
                        </div>
                      </div>
                      {interview.link ? (
                        <a href={interview.link} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-primary-600 hover:bg-primary-750 text-white text-[10px] font-bold rounded-lg shadow-sm">
                          Join Call
                        </a>
                      ) : (
                        <span className="text-[10px] text-dark-400 italic">{interview.venue || 'On-Campus'}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right sidebar info */}
          <div className="space-y-6">
            
            {/* Resume Score */}
            <div className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-6 shadow-md text-center">
              <h3 className="font-display font-semibold text-dark-900 dark:text-white text-sm mb-4">Resume & Profile Score</h3>
              <div className="relative w-28 h-28 mx-auto mb-4">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="8" fill="none" className="text-dark-100 dark:text-dark-850" />
                  <circle cx="60" cy="60" r="50" stroke="url(#progressGradient)" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={`${stats.profileCompletion * 3.14} 314`} />
                  <defs>
                    <linearGradient id="progressGradient">
                      <stop stopColor="#6366f1" />
                      <stop offset="1" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-display font-extrabold text-dark-900 dark:text-white">{stats.profileCompletion}%</span>
                </div>
              </div>
              <Link to="/ai-tools" className="block w-full text-center py-2 bg-gradient-to-r from-primary-600 to-accent-500 text-white text-[10px] font-bold rounded-xl hover:opacity-90 shadow-sm">
                Get AI Analyzer Insights
              </Link>
            </div>

            {/* Navigation links */}
            <div className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-5 shadow-sm">
              <h3 className="font-display font-semibold text-dark-900 dark:text-white text-sm mb-3">Quick Navigation</h3>
              <div className="space-y-1">
                {[
                  { label: 'Edit Placement Profile', path: '/student/profile', icon: <HiOutlineUser /> },
                  { label: 'Pre-Placement Drives', path: '/placement-drives', icon: <HiOutlineCalendar /> },
                  { label: 'Pre-Placement Training', path: '/training-programs', icon: <HiOutlineAcademicCap /> },
                  { label: 'Interactive Calendar', path: '/calendar', icon: <HiOutlineCalendar /> },
                ].map((act, i) => (
                  <Link key={i} to={act.path} className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-800 text-xs font-semibold text-dark-700 dark:text-dark-200 transition-colors">
                    <span className="text-primary-500">{act.icon}</span> {act.label}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
