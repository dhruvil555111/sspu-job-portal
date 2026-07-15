import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { jobAPI, publicAPI } from '../../services/api';
import { HiOutlineSearch, HiOutlineFilter, HiOutlineLocationMarker, HiOutlineCurrencyRupee, HiOutlineClock, HiOutlineBookmark, HiOutlineBriefcase, HiOutlineX } from 'react-icons/hi';

const JobsListing = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ search: '', department: '', jobType: '', workMode: '', location: '', page: 1 });
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0, currentPage: 1 });

  useEffect(() => {
    const fetchDepts = async () => { try { const { data } = await publicAPI.getDepartments(); setDepartments(data.departments || []); } catch {} };
    fetchDepts();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = {};
        Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
        const { data } = await jobAPI.getAll(params);
        setJobs(data.jobs || []);
        setPagination({ total: data.total, totalPages: data.totalPages, currentPage: data.currentPage });
      } catch {
        // Use sample data if API not connected
        setJobs([
          { _id: '1', title: 'Software Engineer', company: { name: 'TCS', logo: { url: '' } }, location: 'Mumbai', jobType: 'full-time', workMode: 'hybrid', package: { min: 6, max: 8 }, requiredSkills: ['Java', 'Spring Boot'], deadline: new Date(Date.now() + 7 * 86400000), createdAt: new Date() },
          { _id: '2', title: 'Frontend Developer', company: { name: 'Wipro', logo: { url: '' } }, location: 'Bangalore', jobType: 'full-time', workMode: 'onsite', package: { min: 8, max: 12 }, requiredSkills: ['React', 'TypeScript'], deadline: new Date(Date.now() + 14 * 86400000), createdAt: new Date() },
          { _id: '3', title: 'Data Analyst Intern', company: { name: 'Infosys', logo: { url: '' } }, location: 'Pune', jobType: 'internship', workMode: 'remote', package: { min: 0.25, max: 0.25 }, requiredSkills: ['Python', 'SQL'], deadline: new Date(Date.now() + 5 * 86400000), createdAt: new Date() },
          { _id: '4', title: 'Cloud Engineer', company: { name: 'Amazon', logo: { url: '' } }, location: 'Hyderabad', jobType: 'full-time', workMode: 'onsite', package: { min: 18, max: 25 }, requiredSkills: ['AWS', 'Docker'], deadline: new Date(Date.now() + 10 * 86400000), createdAt: new Date() },
          { _id: '5', title: 'Business Analyst', company: { name: 'Deloitte', logo: { url: '' } }, location: 'Ahmedabad', jobType: 'full-time', workMode: 'hybrid', package: { min: 7, max: 10 }, requiredSkills: ['Excel', 'Power BI'], deadline: new Date(Date.now() + 3 * 86400000), createdAt: new Date() },
          { _id: '6', title: 'UI/UX Designer', company: { name: 'Adobe', logo: { url: '' } }, location: 'Noida', jobType: 'internship', workMode: 'remote', package: { min: 0.3, max: 0.3 }, requiredSkills: ['Figma', 'Sketch'], deadline: new Date(Date.now() + 8 * 86400000), createdAt: new Date() },
        ]);
        setPagination({ total: 6, totalPages: 1, currentPage: 1 });
      } finally { setLoading(false); }
    };
    fetchJobs();
  }, [filters]);

  const typeColors = { 'full-time': 'badge-primary', internship: 'badge-success', 'part-time': 'badge-warning', contract: 'badge-danger' };

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-dark-900 dark:text-white mb-2">Find Your <span className="text-gradient">Dream Job</span></h1>
          <p className="text-dark-500">Explore {pagination.total || 'hundreds of'} opportunities from top companies</p>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-800 rounded-2xl p-4 shadow-lg border border-dark-100 dark:border-dark-700 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input type="text" value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="input-field pl-12" placeholder="Search jobs, companies, skills..." />
            </div>
            <div className="flex gap-3">
              <select value={filters.jobType} onChange={e => setFilters({ ...filters, jobType: e.target.value, page: 1 })} className="input-field w-auto min-w-[140px]">
                <option value="">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="internship">Internship</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
              </select>
              <select value={filters.workMode} onChange={e => setFilters({ ...filters, workMode: e.target.value, page: 1 })} className="input-field w-auto min-w-[130px]">
                <option value="">All Modes</option>
                <option value="onsite">Onsite</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>
              <button onClick={() => setShowFilters(!showFilters)} className="p-3 rounded-xl border border-dark-200 dark:border-dark-600 text-dark-500 hover:bg-dark-50 dark:hover:bg-dark-700 transition-all">
                <HiOutlineFilter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-dark-100 dark:border-dark-700 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select value={filters.department} onChange={e => setFilters({ ...filters, department: e.target.value, page: 1 })} className="input-field">
                <option value="">All Departments</option>
                {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
              <input type="text" value={filters.location} onChange={e => setFilters({ ...filters, location: e.target.value, page: 1 })} className="input-field" placeholder="Location" />
              <button onClick={() => setFilters({ search: '', department: '', jobType: '', workMode: '', location: '', page: 1 })} className="flex items-center justify-center gap-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all py-3">
                <HiOutlineX className="w-4 h-4" /> Clear Filters
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-dark-100 dark:border-dark-700">
                <div className="skeleton h-6 w-3/4 mb-3" /><div className="skeleton h-4 w-1/2 mb-4" />
                <div className="skeleton h-4 w-full mb-2" /><div className="skeleton h-4 w-2/3 mb-4" />
                <div className="skeleton h-10 w-full" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <HiOutlineBriefcase className="w-16 h-16 mx-auto text-dark-300 dark:text-dark-600 mb-4" />
            <h3 className="text-xl font-display font-semibold text-dark-900 dark:text-white mb-2">No Jobs Found</h3>
            <p className="text-dark-500">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job, i) => (
              <motion.div key={job._id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="group bg-white dark:bg-dark-800 rounded-2xl p-6 border border-dark-100 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-dark-100 dark:bg-dark-700 flex items-center justify-center text-xl font-bold text-primary-600">{job.company?.name?.charAt(0)}</div>
                    <div>
                      <h3 className="font-semibold text-dark-900 dark:text-white group-hover:text-primary-600 transition-colors">{job.title}</h3>
                      <p className="text-sm text-dark-500">{job.company?.name}</p>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 text-dark-400 hover:text-primary-500 transition-all"><HiOutlineBookmark className="w-5 h-5" /></button>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`badge ${typeColors[job.jobType] || 'badge-primary'}`}>{job.jobType?.replace('-', ' ')}</span>
                  <span className="badge bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-300">{job.workMode}</span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="flex items-center gap-2 text-sm text-dark-500"><HiOutlineLocationMarker className="w-4 h-4" /> {job.location || 'N/A'}</p>
                  <p className="flex items-center gap-2 text-sm text-dark-500"><HiOutlineCurrencyRupee className="w-4 h-4" /> {job.package?.min} - {job.package?.max} LPA</p>
                  <p className="flex items-center gap-2 text-sm text-dark-400"><HiOutlineClock className="w-4 h-4" /> Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {job.requiredSkills?.slice(0, 4).map(skill => (
                    <span key={skill} className="px-2.5 py-1 bg-dark-50 dark:bg-dark-700 text-dark-600 dark:text-dark-300 text-xs rounded-lg font-medium">{skill}</span>
                  ))}
                </div>
                <Link to={`/jobs/${job._id}`} className="block w-full text-center py-2.5 rounded-xl border-2 border-primary-500 text-primary-600 dark:text-primary-400 font-semibold text-sm hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 dark:hover:text-white transition-all">View & Apply</Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            {[...Array(pagination.totalPages)].map((_, i) => (
              <button key={i} onClick={() => setFilters({ ...filters, page: i + 1 })}
                className={`w-10 h-10 rounded-xl font-medium text-sm transition-all ${pagination.currentPage === i + 1 ? 'bg-primary-600 text-white shadow-lg' : 'bg-white dark:bg-dark-800 text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700 border border-dark-200 dark:border-dark-600'}`}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsListing;
