import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { studentAPI, adminAPI } from '../services/api';
import { HiOutlineAcademicCap, HiOutlineUser, HiOutlineClock, HiOutlineLocationMarker, HiOutlineUserGroup } from 'react-icons/hi';
import toast from 'react-hot-toast';

const TrainingPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const [studentProfile, setStudentProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let programsList = [];
        if (isAuthenticated && ['tpo', 'superadmin', 'coordinator'].includes(user.role)) {
          const { data } = await adminAPI.getTrainingPrograms();
          programsList = data.programs || [];
        } else if (isAuthenticated && ['student', 'alumni'].includes(user.role)) {
          const [progRes, profileRes] = await Promise.all([
            studentAPI.getTrainingPrograms(),
            studentAPI.getProfile(),
          ]);
          programsList = progRes.data.programs || [];
          setStudentProfile(profileRes.data.student);
        } else {
          const { data } = await adminAPI.getTrainingPrograms();
          programsList = data.programs || [];
        }
        setPrograms(programsList);
      } catch (error) {
        toast.error('Failed to load training programs');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, user]);

  const handleRegister = async (programId) => {
    try {
      const { data } = await studentAPI.registerTrainingProgram(programId);
      if (data.success) {
        toast.success('Registered successfully!');
        setPrograms(prev => prev.map(p => {
          if (p._id === programId) {
            return {
              ...p,
              registeredStudents: [...p.registeredStudents, studentProfile._id],
            };
          }
          return p;
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-dark-50 dark:bg-dark-950 text-dark-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-dark-900 dark:text-white">
            Pre-Placement Training Programs
          </h1>
          <p className="text-sm text-dark-500 dark:text-dark-400 mt-2 max-w-xl">
            Upgrade your industry-ready skills with workshops, coding bootcamps, and certification programs led by experts.
          </p>
        </div>

        {/* Programs list */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="skeleton h-72 rounded-2xl" />
            ))}
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-dark-900 rounded-3xl border border-dark-100 dark:border-dark-800">
            <HiOutlineAcademicCap className="w-16 h-16 text-dark-300 dark:text-dark-700 mx-auto mb-4" />
            <h3 className="text-lg font-display font-bold text-dark-700 dark:text-dark-300">No Programs Scheduled</h3>
            <p className="text-sm text-dark-400 mt-1">Check back later for new workshops and webinars.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((prog) => {
              const isRegistered = studentProfile && prog.registeredStudents?.includes(studentProfile._id);
              const isFull = prog.maxParticipants && prog.registeredStudents?.length >= prog.maxParticipants;
              const isPast = new Date(prog.startDate) < new Date();

              return (
                <motion.div
                  key={prog._id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="badge badge-primary uppercase text-[9px] font-bold">
                        {prog.type}
                      </span>
                      <span className={`text-[10px] font-semibold ${isPast ? 'text-danger-500' : 'text-success-500'}`}>
                        {isPast ? 'Closed' : 'Open'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-bold text-dark-900 dark:text-white text-lg mb-2 leading-snug">
                      {prog.title}
                    </h3>

                    {/* Desc */}
                    <p className="text-xs text-dark-500 dark:text-dark-400 mb-6 line-clamp-3">
                      {prog.description || 'Pre-placement training sessions focusing on building structural knowledge, algorithmic development, coding logic, and advanced technical skills required by recruiters.'}
                    </p>

                    {/* Meta Grid */}
                    <div className="space-y-2 text-xs text-dark-600 dark:text-dark-450 mb-6 border-t border-dark-50 dark:border-dark-850 pt-4">
                      <div className="flex items-center gap-2">
                        <HiOutlineUser className="w-4 h-4 text-primary-500" />
                        <span><strong>Trainer:</strong> {prog.trainer?.name} ({prog.trainer?.organization})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HiOutlineClock className="w-4 h-4 text-pink-500" />
                        <span>{new Date(prog.startDate).toLocaleDateString()} &bull; {prog.duration || '2 Hours'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HiOutlineLocationMarker className="w-4 h-4 text-purple-500" />
                        <span><strong>Venue:</strong> {prog.venue} ({prog.mode})</span>
                      </div>
                      {prog.maxParticipants && (
                        <div className="flex items-center gap-2">
                          <HiOutlineUserGroup className="w-4 h-4 text-green-500" />
                          <span>
                            <strong>Seats:</strong> {prog.registeredStudents?.length || 0} / {prog.maxParticipants} registered
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Button */}
                  <div className="pt-4 border-t border-dark-100 dark:border-dark-800">
                    {isRegistered ? (
                      <button disabled className="w-full py-2.5 bg-green-500/10 text-green-500 text-xs font-semibold rounded-xl cursor-not-allowed text-center">
                        Registered
                      </button>
                    ) : isPast ? (
                      <button disabled className="w-full py-2.5 bg-dark-150 dark:bg-dark-800 text-dark-400 text-xs font-semibold rounded-xl cursor-not-allowed text-center">
                        Program Completed
                      </button>
                    ) : isFull ? (
                      <button disabled className="w-full py-2.5 bg-red-500/10 text-red-500 text-xs font-semibold rounded-xl cursor-not-allowed text-center">
                        Seats Full
                      </button>
                    ) : !isAuthenticated ? (
                      <a href="/login" className="block w-full text-center py-2.5 bg-primary-600 hover:bg-primary-750 text-white text-xs font-semibold rounded-xl">
                        Login to Register
                      </a>
                    ) : user.role === 'student' ? (
                      <button onClick={() => handleRegister(prog._id)} className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all">
                        Register Program
                      </button>
                    ) : (
                      <span className="text-dark-400 text-xs font-semibold text-center block">TPO View Only</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default TrainingPrograms;
