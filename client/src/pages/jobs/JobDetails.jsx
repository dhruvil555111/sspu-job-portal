import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { jobAPI, studentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineLocationMarker, HiOutlineCurrencyRupee, HiOutlineClock, HiOutlineAcademicCap, HiOutlineBookmark, HiOutlineBriefcase, HiOutlineArrowLeft, HiOutlineShieldCheck, HiOutlineCheckCircle, HiOutlineLockClosed } from 'react-icons/hi';
import toast from 'react-hot-toast';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState(null);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const { data } = await jobAPI.getById(id);
        if (data.success) {
          setJob(data.job);
        }
      } catch (error) {
        toast.error('Failed to load job details');
        navigate('/jobs');
      }
    };

    const fetchStudentState = async () => {
      if (isAuthenticated && (user.role === 'student' || user.role === 'alumni')) {
        try {
          const [profileRes, appsRes, savedRes] = await Promise.all([
            studentAPI.getProfile(),
            studentAPI.getApplications(),
            studentAPI.getSavedJobs(),
          ]);

          setStudentProfile(profileRes.data.student);
          
          // Check if already applied
          const hasApplied = appsRes.data.applications?.some(app => app.job?._id === id || app.job === id);
          setApplied(hasApplied);

          // Check if already saved
          const hasSaved = savedRes.data.savedJobs?.some(savedJob => savedJob._id === id || savedJob === id);
          setSaved(hasSaved);
        } catch (error) {
          console.error('Failed to load student status', error);
        }
      }
    };

    const loadAll = async () => {
      setLoading(true);
      await fetchJobDetails();
      await fetchStudentState();
      setLoading(false);
    };

    loadAll();
  }, [id, isAuthenticated, user, navigate]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to apply');
      return navigate('/login');
    }

    setSubmitting(true);
    try {
      const { data } = await studentAPI.apply(id, { coverLetter });
      if (data.success) {
        toast.success('Application submitted successfully!');
        setApplied(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!isAuthenticated) return navigate('/login');
    try {
      const { data } = await studentAPI.toggleSaveJob(id);
      if (data.success) {
        setSaved(prev => !prev);
        toast.success(saved ? 'Job removed from saved list' : 'Job saved successfully!');
      }
    } catch (error) {
      toast.error('Failed to update job status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-dark-50 dark:bg-dark-950">
        <div className="text-center">
          <div className="skeleton w-24 h-6 mb-4 mx-auto rounded-full" />
          <div className="skeleton w-48 h-8 mb-2 mx-auto rounded-xl" />
          <div className="skeleton w-64 h-16 rounded-xl mx-auto" />
        </div>
      </div>
    );
  }

  if (!job) return null;

  const isPast = new Date(job.deadline) < new Date();
  const cgpaMet = studentProfile ? studentProfile.cgpa >= (job.eligibility?.minCGPA || 0) : true;
  const deptMet = studentProfile && job.eligibility?.departments?.length > 0
    ? job.eligibility.departments.some(d => d._id === studentProfile.department?._id || d === studentProfile.department)
    : true;
  const isEligible = cgpaMet && deptMet;

  return (
    <div className="min-h-screen pt-24 bg-dark-50 dark:bg-dark-950 text-dark-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* Back Link */}
        <Link to="/jobs" className="inline-flex items-center gap-2 text-xs font-semibold text-dark-500 hover:text-primary-500 transition-colors mb-8">
          <HiOutlineArrowLeft className="w-4 h-4" /> Back to listings
        </Link>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Details Block */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header info */}
            <div className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-6 sm:p-8 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  {job.company?.logo?.url ? (
                    <img src={job.company.logo.url} alt={job.company.name} className="w-16 h-16 rounded-2xl object-contain bg-dark-50 dark:bg-dark-800 p-1 border border-dark-100" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-2xl font-display shadow-inner">
                      {job.company?.name?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white leading-tight">{job.title}</h1>
                    <p className="text-sm font-semibold text-primary-500 mt-1">{job.company?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button onClick={handleSaveToggle} className={`p-3 rounded-xl border transition-all ${saved ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'border-dark-200 dark:border-dark-750 text-dark-400 hover:text-primary-500 hover:bg-dark-50 dark:hover:bg-dark-800'}`}>
                    <HiOutlineBookmark className={`w-5 h-5 ${saved ? 'fill-amber-500' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Badges Grid */}
              <div className="flex flex-wrap gap-2.5 mb-6 border-b border-dark-50 dark:border-dark-850 pb-6">
                <span className="badge badge-primary uppercase text-[10px] font-bold px-3 py-1">{job.jobType?.replace('-', ' ')}</span>
                <span className="badge bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-300 uppercase text-[10px] font-bold px-3 py-1">{job.workMode}</span>
                <span className="badge bg-green-500/10 text-green-500 uppercase text-[10px] font-bold px-3 py-1">{job.status}</span>
              </div>

              {/* Metadata list */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-dark-500">
                <div>
                  <span className="text-dark-400 block uppercase font-bold text-[9px] mb-1">Package Offered</span>
                  <p className="text-base font-extrabold text-dark-900 dark:text-white flex items-center gap-1">
                    <HiOutlineCurrencyRupee className="w-5 h-5 text-primary-500" /> {job.package?.min} - {job.package?.max} LPA
                  </p>
                </div>
                <div>
                  <span className="text-dark-400 block uppercase font-bold text-[9px] mb-1">Job Location</span>
                  <p className="text-base font-extrabold text-dark-900 dark:text-white flex items-center gap-1">
                    <HiOutlineLocationMarker className="w-5 h-5 text-pink-500" /> {job.location || 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-dark-400 block uppercase font-bold text-[9px] mb-1">Application Deadline</span>
                  <p className="text-base font-extrabold text-dark-900 dark:text-white flex items-center gap-1">
                    <HiOutlineClock className="w-5 h-5 text-purple-500" /> {new Date(job.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>

            </div>

            {/* Description & Responsibilities */}
            <div className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-6 sm:p-8 shadow-md text-left">
              <h3 className="font-display font-bold text-lg text-dark-900 dark:text-white mb-4">Job Description</h3>
              <p className="text-xs sm:text-sm text-dark-600 dark:text-dark-350 leading-relaxed whitespace-pre-line mb-8">
                {job.description || 'No description provided. Please read eligibility requirements and contact recruiter coordination desk for details.'}
              </p>

              {job.requirements && (
                <>
                  <h3 className="font-display font-bold text-lg text-dark-900 dark:text-white mb-4">Job Requirements & Scope</h3>
                  <p className="text-xs sm:text-sm text-dark-600 dark:text-dark-350 leading-relaxed whitespace-pre-line mb-8">
                    {job.requirements}
                  </p>
                </>
              )}

              {/* Skills required */}
              <h3 className="font-display font-bold text-sm text-dark-900 dark:text-white mb-3">Required Technical Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills?.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-dark-50 dark:bg-dark-800 border border-dark-100 dark:border-dark-750 text-dark-700 dark:text-dark-300 text-xs rounded-xl font-bold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar - Application & Eligibility */}
          <div className="space-y-6">
            
            {/* Eligibility Box */}
            <div className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-6 shadow-md text-left">
              <h3 className="font-display font-bold text-dark-900 dark:text-white text-base mb-4 border-b border-dark-50 dark:border-dark-850 pb-3">
                Eligibility Criteria
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-dark-400 block uppercase font-bold text-[9px] mb-1">Minimum CGPA Required</span>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-dark-900 dark:text-white">{job.eligibility?.minCGPA || '0.0'} CGPA</span>
                    {studentProfile && (
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${cgpaMet ? 'bg-success-500/10 text-success-500' : 'bg-danger-500/10 text-danger-500'}`}>
                        {cgpaMet ? 'Met' : 'Unmet'} (Yours: {studentProfile.cgpa})
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-dark-400 block uppercase font-bold text-[9px] mb-1">Eligible Departments</span>
                  <div className="space-y-1">
                    <div className="flex flex-wrap gap-1 mt-1">
                      {job.eligibility?.departments?.map((d, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold text-[9px] rounded-lg">
                          {d.code || d}
                        </span>
                      )) || <span className="font-medium text-dark-600 dark:text-dark-300">All Departments Eligible</span>}
                    </div>
                    {studentProfile && job.eligibility?.departments?.length > 0 && (
                      <div className="pt-1.5 flex justify-end">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${deptMet ? 'bg-success-500/10 text-success-500' : 'bg-danger-500/10 text-danger-500'}`}>
                          {deptMet ? 'Department Eligible' : 'Department Ineligible'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-dark-400 block uppercase font-bold text-[9px] mb-1">Eligible Passing Years</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {job.eligibility?.passingYears?.map((year) => (
                      <span key={year} className="px-2 py-0.5 bg-dark-50 dark:bg-dark-800 text-dark-600 dark:text-dark-350 font-bold text-[9px] rounded-lg">
                        {year}
                      </span>
                    )) || <span className="font-medium text-dark-600 dark:text-dark-300">Open to all batches</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Application Actions */}
            <div className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-6 shadow-md text-left">
              <h3 className="font-display font-bold text-dark-900 dark:text-white text-base mb-4 border-b border-dark-50 dark:border-dark-850 pb-3">
                Apply for Job
              </h3>

              {!isAuthenticated ? (
                <div className="text-center py-4 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-dark-50 dark:bg-dark-800 flex items-center justify-center mx-auto text-dark-400">
                    <HiOutlineLockClosed className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-dark-500">You must be logged in to apply for this campus placement job opening.</p>
                  <Link to="/login" className="block w-full btn-primary py-2.5 rounded-xl text-xs font-bold shadow-md">
                    Login to Apply
                  </Link>
                </div>
              ) : user.role !== 'student' && user.role !== 'alumni' ? (
                <div className="p-3 bg-dark-50 dark:bg-dark-850 rounded-2xl border border-dark-100 dark:border-dark-800 text-center">
                  <p className="text-xs text-dark-500 font-semibold">Recruiter / Admin Portal View</p>
                  <p className="text-[10px] text-dark-400 mt-1">Only student/alumni accounts are permitted to apply for active job openings.</p>
                </div>
              ) : applied ? (
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-success-500/10 text-success-500 flex items-center justify-center mx-auto">
                    <HiOutlineCheckCircle className="w-7 h-7" />
                  </div>
                  <p className="text-xs font-bold text-dark-900 dark:text-white">Already Applied</p>
                  <p className="text-[10px] text-dark-500">Your application has been received and is pending coordinator screening reviews.</p>
                  <Link to="/student/dashboard" className="block w-full text-center py-2.5 bg-dark-50 dark:bg-dark-800 hover:bg-dark-100 dark:hover:bg-dark-750 text-dark-700 dark:text-dark-200 text-xs font-semibold rounded-xl border border-dark-200 dark:border-dark-700 transition-all">
                    Track Applications
                  </Link>
                </div>
              ) : isPast ? (
                <div className="p-4 bg-danger-500/10 text-danger-500 border border-danger-500/20 rounded-2xl text-center">
                  <p className="text-xs font-bold">Drive Closed</p>
                  <p className="text-[10px] mt-1 text-dark-500">The application submission deadline has passed for this job posting.</p>
                </div>
              ) : !isEligible ? (
                <div className="p-4 bg-danger-500/10 text-danger-500 border border-danger-500/20 rounded-2xl text-center">
                  <p className="text-xs font-bold">Ineligible</p>
                  <p className="text-[10px] mt-1 text-dark-500">You do not meet the minimum CGPA or department criteria requested by this company.</p>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-dark-400 uppercase block mb-1">Cover Letter (Optional)</label>
                    <textarea
                      rows={4}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Explain why you are a good fit for this role..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-850 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-primary py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-primary-500/15"
                  >
                    <HiOutlineBriefcase className="w-4 h-4" /> {submitting ? 'Submitting...' : 'Apply For Job'}
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default JobDetails;
