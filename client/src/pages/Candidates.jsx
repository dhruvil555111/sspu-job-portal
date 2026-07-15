import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentAPI, publicAPI } from '../services/api';
import { Search, MapPin, Briefcase, GraduationCap, Award, ExternalLink, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const Candidates = () => {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({
    department: '',
    passingYear: '',
    minCGPA: '',
    skills: '',
    sort: '-createdAt'
  });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  // Access control
  const isAuthorized = user && ['recruiter', 'tpo', 'coordinator', 'superadmin'].includes(user.role);

  useEffect(() => {
    if (!isAuthorized) {
      setLoading(false);
      return;
    }

    const fetchDepts = async () => {
      try {
        const { data } = await publicAPI.getDepartments();
        setDepartments(data.departments || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDepts();
  }, [isAuthorized]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.page,
        limit: 12
      };
      // Clean empty filters
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const { data } = await studentAPI.getAll(params);
      setCandidates(data.students || []);
      setPagination(prev => ({
        ...prev,
        totalPages: data.totalPages || 1
      }));
    } catch (err) {
      toast.error('Failed to load candidates registry');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchCandidates();
    }
  }, [filters, pagination.page, isAuthorized]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-950 px-4 pt-20">
        <div className="bg-white dark:bg-dark-900 p-8 rounded-3xl border border-slate-100 dark:border-dark-800 shadow-2xl max-w-md w-full text-center">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Restricted</h2>
          <p className="text-slate-500 dark:text-dark-400 text-sm mb-6">You must log in to view the university candidate directory.</p>
          <a href="/login" className="inline-block w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl shadow-lg transition">Login Now</a>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-950 px-4 pt-20">
        <div className="bg-white dark:bg-dark-900 p-8 rounded-3xl border border-slate-100 dark:border-dark-800 shadow-2xl max-w-md w-full text-center">
          <ShieldAlert className="w-16 h-16 text-amber-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Recruiters Only</h2>
          <p className="text-slate-500 dark:text-dark-400 text-sm mb-6">The candidate database is restricted to verified employers, placement coordinators, and admins.</p>
          <a href="/" className="inline-block w-full py-3 bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl transition">Back to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Candidate Directory</h1>
          <p className="text-slate-500 dark:text-dark-400 text-sm">Search and source high-caliber students of Shree Saurashtra Patel University.</p>
        </div>

        {/* Search Filters Row */}
        <div className="bg-white dark:bg-dark-900 p-6 rounded-3xl border border-slate-100 dark:border-dark-800 shadow-md mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Keyword Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="skills"
              value={filters.skills}
              onChange={handleFilterChange}
              placeholder="Search skills (e.g. React)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-dark-800 rounded-xl text-xs font-semibold border border-slate-100 dark:border-dark-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Department Select */}
          <div>
            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-dark-800 rounded-xl text-xs font-semibold border border-slate-100 dark:border-dark-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* passingYear */}
          <div>
            <input
              type="number"
              name="passingYear"
              value={filters.passingYear}
              onChange={handleFilterChange}
              placeholder="Graduation Year (e.g. 2026)"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-dark-800 rounded-xl text-xs font-semibold border border-slate-100 dark:border-dark-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Minimum CGPA */}
          <div>
            <input
              type="number"
              step="0.1"
              name="minCGPA"
              value={filters.minCGPA}
              onChange={handleFilterChange}
              placeholder="Minimum CGPA (e.g. 8.0)"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-dark-800 rounded-xl text-xs font-semibold border border-slate-100 dark:border-dark-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Sort selection */}
          <div>
            <select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-dark-800 rounded-xl text-xs font-semibold border border-slate-100 dark:border-dark-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value="-createdAt">Newest Profiles</option>
              <option value="-cgpa">Highest CGPA</option>
              <option value="passingYear">Passing Year (Asc)</option>
            </select>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-dark-900 rounded-3xl p-6 border border-slate-100 dark:border-dark-800 h-64 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-dark-800" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 dark:bg-dark-800 rounded w-2/3" />
                    <div className="h-3 bg-slate-200 dark:bg-dark-800 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-slate-200 dark:bg-dark-800 rounded w-full mb-2" />
                <div className="h-3 bg-slate-200 dark:bg-dark-800 rounded w-5/6 mb-4" />
                <div className="flex gap-2">
                  <div className="h-6 bg-slate-200 dark:bg-dark-800 rounded w-16" />
                  <div className="h-6 bg-slate-200 dark:bg-dark-800 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : candidates.length === 0 ? (
          <div className="bg-white dark:bg-dark-900 p-12 rounded-3xl border border-slate-100 dark:border-dark-800 shadow-md text-center max-w-xl mx-auto">
            <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Candidates Found</h3>
            <p className="text-slate-500 dark:text-dark-400 text-sm">Try widening your filters or search keywords.</p>
          </div>
        ) : (
          /* Candidates Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((c) => (
              <div
                key={c._id}
                className="bg-white dark:bg-dark-900 rounded-3xl p-6 border border-slate-100 dark:border-dark-800 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg border-2 border-white dark:border-dark-800 shadow-md">
                    {c.user?.avatar ? (
                      <img src={c.user.avatar} alt="avatar" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      c.user?.name ? c.user.name.charAt(0).toUpperCase() : 'S'
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white hover:text-primary-500 transition-colors">
                      {c.user?.name || 'Anonymous Student'}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-primary-500" />
                      {c.department?.name || 'SSPU Student'}
                    </p>
                  </div>
                </div>

                {/* Candidate details */}
                <div className="space-y-2 border-t border-slate-100/50 dark:border-dark-800/50 pt-4 mb-4 text-left">
                  <p className="text-xs text-slate-500 dark:text-dark-400">
                    Graduation Year: <strong className="text-slate-800 dark:text-slate-200">{c.passingYear || 'N/A'}</strong>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-dark-400">
                    Academic CGPA: <strong className="text-primary-600 dark:text-primary-400">{c.cgpa ? c.cgpa.toFixed(2) : 'N/A'}</strong>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-dark-400">
                    Status: <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${c.isPlaced ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'}`}>{c.isPlaced ? 'Placed' : 'Active Seeker'}</span>
                  </p>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mb-5 h-16 overflow-hidden">
                  {c.skills && c.skills.length > 0 ? (
                    c.skills.map((skill, index) => (
                      <span key={index} className="px-2.5 py-0.5 bg-slate-50 dark:bg-dark-800 text-slate-600 dark:text-slate-300 text-[10px] rounded-lg font-semibold">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No skills listed</span>
                  )}
                </div>

                {/* Resume Download or Profile action */}
                <div className="border-t border-slate-100/50 dark:border-dark-800/50 pt-4 flex gap-3">
                  {c.resume ? (
                    <a
                      href={c.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 text-center text-xs font-bold border border-primary-500/50 text-primary-500 hover:bg-primary-500 hover:text-white rounded-xl transition"
                    >
                      View Resume
                    </a>
                  ) : (
                    <button disabled className="flex-1 py-2 text-center text-xs font-semibold bg-slate-100 dark:bg-dark-800 text-slate-400 rounded-xl cursor-not-allowed">
                      No Resume
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl disabled:opacity-50 transition"
            >
              Prev
            </button>
            <span className="text-xs font-bold text-slate-500 dark:text-dark-400">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.page + 1, pagination.totalPages) }))}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl disabled:opacity-50 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Candidates;
