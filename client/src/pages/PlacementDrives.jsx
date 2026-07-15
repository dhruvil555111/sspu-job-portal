import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { studentAPI, adminAPI } from '../services/api';
import { HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineAcademicCap, HiOutlineShieldCheck, HiOutlineLockClosed } from 'react-icons/hi';
import toast from 'react-hot-toast';

const PlacementDrives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const [studentProfile, setStudentProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let drivesList = [];
        if (isAuthenticated && ['tpo', 'superadmin', 'coordinator'].includes(user.role)) {
          const { data } = await adminAPI.getPlacementDrives();
          drivesList = data.drives || [];
        } else if (isAuthenticated && ['student', 'alumni'].includes(user.role)) {
          const [drivesRes, profileRes] = await Promise.all([
            studentAPI.getPlacementDrives(),
            studentAPI.getProfile(),
          ]);
          drivesList = drivesRes.data.drives || [];
          setStudentProfile(profileRes.data.student);
        } else {
          // If not authenticated, can mock or get list
          const { data } = await adminAPI.getPlacementDrives(); // Fallback if allowed or mock
          drivesList = data.drives || [];
        }
        setDrives(drivesList);
      } catch (error) {
        toast.error('Failed to load placement drives');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, user]);

  const handleRegister = async (driveId) => {
    try {
      const { data } = await studentAPI.registerPlacementDrive(driveId);
      if (data.success) {
        toast.success(data.message || 'Successfully registered!');
        // Update local state
        setDrives(prev => prev.map(drive => {
          if (drive._id === driveId) {
            return {
              ...drive,
              registeredStudents: [...drive.registeredStudents, studentProfile._id],
            };
          }
          return drive;
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-dark-50 dark:bg-dark-950 text-dark-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-dark-900 dark:text-white">
            Placement Drives
          </h1>
          <p className="text-sm text-dark-500 dark:text-dark-400 mt-2 max-w-xl">
            Register and prepare for upcoming campus placement drives organized by LJ University placement cell.
          </p>
        </div>

        {/* Drives Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="skeleton h-64 rounded-2xl" />
            ))}
          </div>
        ) : drives.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-dark-900 rounded-3xl border border-dark-100 dark:border-dark-800">
            <HiOutlineCalendar className="w-16 h-16 text-dark-300 dark:text-dark-700 mx-auto mb-4" />
            <h3 className="text-lg font-display font-bold text-dark-700 dark:text-dark-300">No Placement Drives</h3>
            <p className="text-sm text-dark-400 mt-1">There are no active placement drives scheduled right now.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {drives.map((drive) => {
              const isRegistered = studentProfile && drive.registeredStudents?.includes(studentProfile._id);
              const eligibilityMet = studentProfile && studentProfile.cgpa >= (drive.minCGPA || 0);
              const isPast = new Date(drive.date) < new Date();

              return (
                <motion.div
                  key={drive._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        {drive.company?.logo?.url ? (
                          <img src={drive.company.logo.url} alt={drive.company.name} className="w-12 h-12 rounded-xl object-contain bg-dark-50 dark:bg-dark-800 p-1" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-base">
                            {drive.company?.name?.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h3 className="font-display font-bold text-dark-900 dark:text-white leading-snug">{drive.title}</h3>
                          <p className="text-xs text-dark-500 mt-0.5">{drive.company?.name}</p>
                        </div>
                      </div>
                      <span className={`badge ${isPast ? 'badge-danger' : 'badge-success'} text-[10px]`}>
                        {isPast ? 'Completed' : 'Upcoming'}
                      </span>
                    </div>

                    {/* Desc */}
                    <p className="text-xs text-dark-550 dark:text-dark-400 mb-6 leading-relaxed">
                      {drive.description || 'Comprehensive campus drive covering online aptitude test, coding challenge, and physical/virtual interviews for student graduates.'}
                    </p>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-2 gap-4 text-xs text-dark-605 mb-6">
                      <div className="flex items-center gap-2">
                        <HiOutlineCalendar className="w-4 h-4 text-primary-500 shrink-0" />
                        <span>{new Date(drive.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HiOutlineLocationMarker className="w-4 h-4 text-pink-500 shrink-0" />
                        <span>{drive.venue || 'LJ Campus Auditorium'}</span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <HiOutlineAcademicCap className="w-4 h-4 text-purple-500 shrink-0" />
                        <span>
                          {drive.eligibleDepartments?.map(d => d.code).join(', ') || 'All Departments Eligible'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="border-t border-dark-100 dark:border-dark-800 pt-4 flex items-center justify-between">
                    <div className="text-xs">
                      <span className="text-dark-400 block uppercase font-semibold text-[9px]">Eligibility</span>
                      <span className="font-bold text-dark-900 dark:text-white">{drive.minCGPA || '0.0'} Min CGPA</span>
                    </div>

                    {isRegistered ? (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-500/10 text-green-500 text-xs font-semibold rounded-xl">
                        <HiOutlineShieldCheck className="w-4 h-4" /> Registered
                      </span>
                    ) : isPast ? (
                      <button disabled className="px-4 py-2 bg-dark-100 dark:bg-dark-800 text-dark-400 text-xs font-semibold rounded-xl cursor-not-allowed">
                        Drive Closed
                      </button>
                    ) : !isAuthenticated ? (
                      <a href="/login" className="px-4 py-2 bg-primary-600 hover:bg-primary-750 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm">
                        <HiOutlineLockClosed className="w-3.5 h-3.5" /> Login to Register
                      </a>
                    ) : user.role === 'student' ? (
                      eligibilityMet ? (
                        <button onClick={() => handleRegister(drive._id)} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all">
                          Register Now
                        </button>
                      ) : (
                        <span className="text-red-500 text-xs font-semibold bg-red-500/10 px-3 py-1.5 rounded-xl">
                          CGPA criteria unmet
                        </span>
                      )
                    ) : (
                      <span className="text-dark-400 text-xs font-semibold">TPO/Admin View Only</span>
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

export default PlacementDrives;
