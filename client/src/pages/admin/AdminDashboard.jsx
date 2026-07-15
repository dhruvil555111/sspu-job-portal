import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import { HiOutlineUsers, HiOutlineOfficeBuilding, HiOutlineBriefcase, HiOutlineAcademicCap, HiOutlineChartBar, HiOutlineTrendingUp, HiOutlineBell, HiOutlineShieldCheck, HiOutlineDownload } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const isSuper = user?.role === 'superadmin';
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalStudents: 0, placedStudents: 0, totalCompanies: 0, pendingCompanies: 0,
    totalJobs: 0, activeJobs: 0, totalApplications: 0, departments: 0,
    highestPackage: 45, avgPackage: 8.5, placementRate: 0
  });

  const [deptStats, setDeptStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        const { data } = await adminAPI.getDashboard();
        if (data.success) {
          const fetchedStats = data.stats;
          const placementRate = Math.round((fetchedStats.placedStudents / (fetchedStats.totalStudents || 1)) * 100);
          
          setStats({
            totalStudents: fetchedStats.totalStudents,
            placedStudents: fetchedStats.placedStudents,
            totalCompanies: fetchedStats.totalCompanies,
            pendingCompanies: fetchedStats.pendingCompanies,
            totalJobs: fetchedStats.totalJobs,
            activeJobs: fetchedStats.activeJobs,
            totalApplications: fetchedStats.totalApplications,
            departments: fetchedStats.totalDepartments,
            highestPackage: fetchedStats.highestPackage || 45,
            avgPackage: fetchedStats.averagePackage || 8.5,
            placementRate,
            pendingApprovals: fetchedStats.pendingCompanies + (fetchedStats.totalJobs - fetchedStats.activeJobs)
          });

          // Set department stats
          setDeptStats(data.departmentStats || []);

          // Map recent activities
          const activities = (data.recentApplications || []).map(app => ({
            text: `Application received: ${app.user?.name} applied for "${app.job?.title}"`,
            time: 'Just now',
            icon: '📄',
            color: 'bg-indigo-100 dark:bg-indigo-900/20'
          }));
          setRecentActivities(activities);
        }
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDashboard();
  }, []);

  const handleExportReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/reports/placements', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error();
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `LJ_University_Placement_Report_${new Date().getFullYear()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Placement report downloaded!');
    } catch (error) {
      toast.error('Failed to export placement report');
    }
  };

  const [activeTab, setActiveTab] = useState('overview');
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <HiOutlineChartBar /> },
    { id: 'students', label: 'Students', icon: <HiOutlineUsers /> },
    { id: 'companies', label: 'Companies', icon: <HiOutlineOfficeBuilding /> },
    { id: 'jobs', label: 'Jobs', icon: <HiOutlineBriefcase /> },
    { id: 'departments', label: 'Departments', icon: <HiOutlineAcademicCap /> },
    { id: 'drives', label: 'Drives', icon: <HiOutlineCalendar /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-50 dark:bg-dark-950 pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-dark-500">Loading admin stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 pt-24 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-dark-900 dark:text-white">
                {isSuper ? 'Super Admin' : 'TPO'} <span className="text-gradient">Console</span>
              </h1>
              <p className="text-xs text-dark-500 mt-1">Placement management & analytics board</p>
            </div>
            <div className="flex gap-2">
              <Link to="/placement-drives" className="px-4 py-2 bg-primary-600 text-white text-xs font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-md flex items-center gap-1.5">
                Manage Drives
              </Link>
              <button onClick={handleExportReport} className="px-4 py-2 bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 text-dark-700 dark:text-dark-200 text-xs font-semibold rounded-xl hover:bg-dark-50 dark:hover:bg-dark-800 transition-all flex items-center gap-1.5 shadow-sm">
                <HiOutlineDownload className="w-4 h-4" /> Export Placement Report
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-1 mb-8 bg-white dark:bg-dark-900 rounded-xl p-1.5 border border-dark-100 dark:border-dark-800 no-scrollbar shadow-sm">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${activeTab === tab.id ? 'bg-primary-600 text-white shadow-md' : 'text-dark-500 hover:text-dark-700 dark:hover:text-dark-200 hover:bg-dark-50 dark:hover:bg-dark-800'}`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Students', value: stats.totalStudents.toLocaleString(), icon: <HiOutlineUsers />, color: 'from-blue-500 to-cyan-400', change: '' },
            { label: 'Students Placed', value: stats.placedStudents.toLocaleString(), icon: <HiOutlineShieldCheck />, color: 'from-emerald-500 to-teal-400', change: `${stats.placementRate}% Rate` },
            { label: 'Companies Active', value: stats.totalCompanies, icon: <HiOutlineOfficeBuilding />, color: 'from-purple-500 to-pink-400', change: '' },
            { label: 'Active Jobs', value: stats.activeJobs, icon: <HiOutlineBriefcase />, color: 'from-amber-500 to-orange-400', change: '' },
            { label: 'Highest Package', value: `₹${stats.highestPackage} LPA`, icon: <HiOutlineTrendingUp />, color: 'from-rose-500 to-red-400', change: 'Top Offer' },
            { label: 'Avg Package', value: `₹${stats.avgPackage} LPA`, icon: <HiOutlineChartBar />, color: 'from-indigo-500 to-violet-400', change: 'Avg Salary' },
            { label: 'Departments', value: stats.departments, icon: <HiOutlineAcademicCap />, color: 'from-teal-500 to-cyan-400', change: '' },
            { label: 'Pending Approvals', value: stats.pendingApprovals, icon: <HiOutlineBell />, color: 'from-orange-500 to-amber-400', change: 'Pending' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="bg-white dark:bg-dark-900 rounded-3xl p-5 border border-dark-100 dark:border-dark-800 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br bg-dark-50 dark:bg-dark-850 flex items-center justify-center text-primary-500 group-hover:scale-105 transition-transform`}>{s.icon}</div>
                {s.change && <span className="text-[10px] font-bold text-emerald-650 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-355 px-2 py-0.5 rounded-full">{s.change}</span>}
              </div>
              <p className="text-2xl font-display font-bold text-dark-900 dark:text-white leading-none">{s.value}</p>
              <p className="text-xs text-dark-505 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Department-wise Stats */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-dark-900 rounded-3xl border border-dark-100 dark:border-dark-800 p-6 shadow-sm">
            <h3 className="font-display font-semibold text-dark-900 dark:text-white text-sm mb-6">Department-wise Placement</h3>
            <div className="space-y-4">
              {deptStats.length === 0 ? (
                <p className="text-xs text-dark-400">No department statistics available.</p>
              ) : (
                deptStats.map((dept, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5 text-xs">
                      <span className="font-semibold text-dark-700 dark:text-dark-200">{dept.department} ({dept.code})</span>
                      <span className="font-bold text-dark-900 dark:text-white">{dept.placementRate || 0}% Rate</span>
                    </div>
                    <div className="h-2 bg-dark-50 dark:bg-dark-850 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${dept.placementRate || 0}%` }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary-500 to-pink-500" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-dark-900 rounded-3xl border border-dark-100 dark:border-dark-800 p-6 shadow-sm">
            <h3 className="font-display font-semibold text-dark-900 dark:text-white text-sm mb-6">Recent Application Submissions</h3>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <p className="text-xs text-dark-400">No recent candidate activities.</p>
              ) : (
                recentActivities.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <div className={`w-9 h-9 rounded-lg ${a.color} flex items-center justify-center flex-shrink-0 text-sm`}>{a.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-dark-700 dark:text-dark-200 font-semibold leading-relaxed">{a.text}</p>
                      <p className="text-[10px] text-dark-400 mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AdminDashboard;
