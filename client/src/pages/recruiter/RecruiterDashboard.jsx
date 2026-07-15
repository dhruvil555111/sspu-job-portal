import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { recruiterAPI, interviewAPI } from '../../services/api';
import { HiOutlineBriefcase, HiOutlineDocumentText, HiOutlineUsers, HiOutlineCheckCircle, HiOutlineArrowRight, HiOutlineTrendingUp, HiOutlineCalendar, HiOutlinePlus, HiOutlineMail } from 'react-icons/hi';
import toast from 'react-hot-toast';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalPostings: 0, activePostings: 0, applicationsReceived: 0, shortlistedCandidates: 0, hiredCandidates: 0 });
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Modal State for scheduling interview
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [interviewForm, setInterviewForm] = useState({
    title: 'Technical Round 1',
    date: '',
    time: '10:00 AM',
    mode: 'online',
    link: '',
    venue: '',
    interviewer: '',
  });

  const fetchDashboard = async () => {
    try {
      const { data } = await recruiterAPI.getDashboard();
      if (data.success) {
        setStats(data.stats);
        setRecentApps(data.recentApplications || []);
      }
    } catch (error) {
      toast.error('Failed to load recruiter statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleUpdateStatus = async (appId, status, remarks = '') => {
    try {
      const { data } = await recruiterAPI.updateApplicationStatus(appId, { status, remarks });
      if (data.success) {
        toast.success(`Candidate status updated to ${status}`);
        fetchDashboard();
      }
    } catch (error) {
      toast.error('Failed to update candidate status');
    }
  };

  const handleScheduleClick = (app) => {
    setSelectedApp(app);
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await interviewAPI.schedule({
        applicationId: selectedApp._id,
        ...interviewForm,
      });
      if (data.success) {
        toast.success('Interview scheduled successfully!');
        setShowScheduleModal(false);
        setInterviewForm({ title: 'Technical Round 1', date: '', time: '10:00 AM', mode: 'online', link: '', venue: '', interviewer: '' });
        fetchDashboard();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule interview');
    }
  };

  const statusColors = {
    applied: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    shortlisted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    interview: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    selected: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-50 dark:bg-dark-950 pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-dark-500">Loading recruiter dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 pt-24 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-dark-900 dark:text-white">
            Recruiter <span className="text-gradient">Console</span>
          </h1>
          <p className="text-xs text-dark-500 mt-1">Acquire and manage student talent for Shree Saurashtra Patel University.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Postings', value: stats.totalPostings, icon: <HiOutlineBriefcase />, color: 'from-blue-505 to-cyan-400' },
            { label: 'Active Postings', value: stats.activePostings, icon: <HiOutlineCheckCircle />, color: 'from-emerald-500 to-teal-400' },
            { label: 'Applications Recd', value: stats.applicationsReceived, icon: <HiOutlineDocumentText />, color: 'from-purple-500 to-pink-400' },
            { label: 'Shortlisted Candidates', value: stats.shortlistedCandidates, icon: <HiOutlineUsers />, color: 'from-amber-500 to-orange-400' },
            { label: 'Hired Candidates', value: stats.hiredCandidates, icon: <HiOutlineTrendingUp />, color: 'from-rose-500 to-red-400' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-5 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br bg-dark-50 dark:bg-dark-850 flex items-center justify-center text-primary-500 mb-3">
                {s.icon}
              </div>
              <p className="text-2xl font-display font-bold text-dark-900 dark:text-white leading-none">{s.value}</p>
              <p className="text-[10px] text-dark-400 font-bold uppercase mt-1.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Candidates list */}
          <div className="lg:col-span-2 bg-white dark:bg-dark-900 rounded-3xl border border-dark-100 dark:border-dark-800 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-dark-100 dark:border-dark-800">
              <h2 className="font-display font-semibold text-dark-900 dark:text-white text-sm">Recent Candidates Applications</h2>
            </div>
            
            {recentApps.length === 0 ? (
              <div className="p-8 text-center text-xs text-dark-400">No student applications received yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-dark-50 dark:bg-dark-950 font-bold text-dark-400 border-b border-dark-100 dark:border-dark-800">
                    <tr>
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3">Job Title</th>
                      <th className="px-4 py-3">CGPA</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-50 dark:divide-dark-850">
                    {recentApps.map((app) => (
                      <tr key={app._id} className="hover:bg-dark-50/50 dark:hover:bg-dark-950/20 transition-colors">
                        <td className="px-4 py-3 font-semibold text-dark-900 dark:text-white">
                          {app.user?.name}
                        </td>
                        <td className="px-4 py-3 text-dark-550 dark:text-dark-400">{app.job?.title}</td>
                        <td className="px-4 py-3 font-bold">{app.student?.cgpa || '0.0'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${statusColors[app.status]}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                          {app.status === 'applied' && (
                            <>
                              <button onClick={() => handleUpdateStatus(app._id, 'shortlisted')} className="px-2 py-1 bg-emerald-500 text-white font-bold rounded-lg text-[9px] hover:bg-emerald-600 transition-colors">
                                Shortlist
                              </button>
                              <button onClick={() => handleUpdateStatus(app._id, 'rejected')} className="px-2 py-1 bg-red-500 text-white font-bold rounded-lg text-[9px] hover:bg-red-600 transition-colors">
                                Reject
                              </button>
                            </>
                          )}
                          {app.status === 'shortlisted' && (
                            <button onClick={() => handleScheduleClick(app)} className="px-2 py-1 bg-amber-500 text-white font-bold rounded-lg text-[9px] hover:bg-amber-600 transition-colors">
                              Schedule Interview
                            </button>
                          )}
                          {app.status === 'interview' && (
                            <button onClick={() => handleUpdateStatus(app._id, 'selected')} className="px-2 py-1 bg-purple-500 text-white font-bold rounded-lg text-[9px] hover:bg-purple-650 transition-colors">
                              Select (Hire)
                            </button>
                          )}
                          {['selected', 'rejected'].includes(app.status) && (
                            <span className="text-[10px] text-dark-400 italic">No actions</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick panel */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary-600 to-accent-500 rounded-3xl p-6 text-white shadow-lg">
              <HiOutlineBriefcase className="w-8 h-8 mb-4" />
              <h3 className="font-display font-bold text-lg mb-2">Create Job Posting</h3>
              <p className="text-white/80 text-xs mb-4">Post job and internship drives for Shree Saurashtra Patel University students.</p>
              <Link to="/jobs" className="block w-full text-center py-2 bg-white text-primary-700 font-bold rounded-xl hover:bg-white/90 transition-all text-xs">
                Post Job Opening
              </Link>
            </div>
            
            <div className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-5 shadow-sm">
              <h3 className="font-display font-semibold text-dark-900 dark:text-white text-sm mb-3">Recruiter Actions</h3>
              <div className="space-y-2">
                <a href="/jobs" className="flex items-center justify-between p-2.5 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-800 text-xs font-semibold text-dark-700 dark:text-dark-200 transition-colors">
                  <span>Manage Active Jobs</span> <HiOutlineArrowRight className="w-4 h-4 text-dark-400" />
                </a>
                <a href="/calendar" className="flex items-center justify-between p-2.5 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-800 text-xs font-semibold text-dark-700 dark:text-dark-200 transition-colors">
                  <span>Interview Calendar</span> <HiOutlineArrowRight className="w-4 h-4 text-dark-400" />
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Schedule Interview Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <h3 className="font-display font-bold text-dark-900 dark:text-white text-base mb-4">
                Schedule Interview: {selectedApp?.user?.name}
              </h3>
              
              <form onSubmit={handleScheduleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-semibold text-dark-500 block mb-1">Round Name</label>
                  <input type="text" required value={interviewForm.title} onChange={(e) => setInterviewForm({ ...interviewForm, title: e.target.value })} className="input-field py-1.5 text-xs" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-dark-500 block mb-1">Date</label>
                    <input type="date" required value={interviewForm.date} onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })} className="input-field py-1.5 text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-dark-500 block mb-1">Time</label>
                    <input type="text" required value={interviewForm.time} onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })} className="input-field py-1.5 text-xs" placeholder="e.g. 11:30 AM" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-dark-500 block mb-1">Mode</label>
                    <select value={interviewForm.mode} onChange={(e) => setInterviewForm({ ...interviewForm, mode: e.target.value })} className="input-field py-1.5 text-xs">
                      <option value="online">Online Call</option>
                      <option value="offline">On-Campus</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-dark-500 block mb-1">Interviewer</label>
                    <input type="text" value={interviewForm.interviewer} onChange={(e) => setInterviewForm({ ...interviewForm, interviewer: e.target.value })} className="input-field py-1.5 text-xs" placeholder="Interviewer Name" />
                  </div>
                </div>

                {interviewForm.mode === 'online' ? (
                  <div>
                    <label className="text-[10px] font-semibold text-dark-500 block mb-1">Meeting Link</label>
                    <input type="text" value={interviewForm.link} onChange={(e) => setInterviewForm({ ...interviewForm, link: e.target.value })} className="input-field py-1.5 text-xs" placeholder="Google Meet / Zoom URL" />
                  </div>
                ) : (
                  <div>
                    <label className="text-[10px] font-semibold text-dark-500 block mb-1">Venue Location</label>
                    <input type="text" value={interviewForm.venue} onChange={(e) => setInterviewForm({ ...interviewForm, venue: e.target.value })} className="input-field py-1.5 text-xs" placeholder="e.g. Block A, Room 302" />
                  </div>
                )}

                <div className="pt-4 flex items-center justify-end gap-2 border-t border-dark-50 dark:border-dark-850 mt-4">
                  <button type="button" onClick={() => setShowScheduleModal(false)} className="px-4 py-2 bg-dark-50 dark:bg-dark-800 text-dark-700 dark:text-dark-200 font-semibold rounded-xl">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl">
                    Confirm & Schedule
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecruiterDashboard;
