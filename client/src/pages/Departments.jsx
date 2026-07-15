import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { publicAPI } from '../services/api';
import { HiOutlineAcademicCap, HiOutlineOfficeBuilding, HiOutlineUserGroup, HiOutlineMail, HiOutlineBadgeCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';

const fallbackDepartments = [
  { name: 'Computer Science', code: 'CS', description: 'Focuses on software development, algorithms, artificial intelligence, and cutting-edge engineering solutions.' },
  { name: 'Information Technology', code: 'IT', description: 'Centers on network security, web technologies, database management, and cloud architecture implementation.' },
  { name: 'Commerce', code: 'COMM', description: 'Covers financial accounting, taxation, auditing, and corporate investment banking training.' },
  { name: 'Management', code: 'MGMT', description: 'Prepares students for leadership roles, business development, HR consulting, and project management.' },
  { name: 'Arts', code: 'ARTS', description: 'Develops humanistic inquiry, critical analysis, media production, and social communications.' },
  { name: 'Science', code: 'SCI', description: 'Emphasizes physical and biological sciences, research methodology, data analysis, and laboratory experiments.' },
  { name: 'Pharmacy', code: 'PHARM', description: 'Focuses on drug formulation, pharmaceutical chemistry, clinical pharmacology, and hospital healthcare.' },
  { name: 'Law', code: 'LAW', description: 'Trains in jurisprudence, corporate governance, legal litigation, and policy advocacy.' },
  { name: 'Engineering', code: 'ENG', description: 'Covers core streams like mechanical, civil, electronics, and power engineering design.' },
  { name: 'Education', code: 'EDU', description: 'Fosters pedagogy development, learning psychology, curriculum design, and academic leadership.' },
];

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const { data } = await publicAPI.getDepartments();
        if (data.success && data.departments && data.departments.length > 0) {
          setDepartments(data.departments);
        } else {
          setDepartments(fallbackDepartments);
        }
      } catch (error) {
        console.warn('API error, using fallback departments list.');
        setDepartments(fallbackDepartments);
      } finally {
        setLoading(false);
      }
    };
    fetchDepts();
  }, []);

  const getIcon = (code) => {
    switch (code) {
      case 'CS':
      case 'IT':
        return <HiOutlineAcademicCap className="w-8 h-8 text-primary-500" />;
      case 'MGMT':
      case 'COMM':
        return <HiOutlineTrendingUp className="w-8 h-8 text-yellow-500" />;
      default:
        return <HiOutlineOfficeBuilding className="w-8 h-8 text-indigo-500" />;
    }
  };

  // Add dummy dynamic details to enrich visual presentation
  const getCoordinator = (code) => {
    const managers = {
      CS: { name: 'Dr. Ramesh K. Vyas', email: 'cs.coord@sspu.edu.in' },
      IT: { name: 'Prof. Sneha J. Patel', email: 'it.coord@sspu.edu.in' },
      COMM: { name: 'Dr. Harish N. Shah', email: 'comm.coord@sspu.edu.in' },
      MGMT: { name: 'Dr. Alpesh M. Mehta', email: 'mgmt.coord@sspu.edu.in' },
      ARTS: { name: 'Prof. Geeta S. Dave', email: 'arts.coord@sspu.edu.in' },
      SCI: { name: 'Dr. Nirav R. Joshi', email: 'sci.coord@sspu.edu.in' },
      PHARM: { name: 'Dr. Hitesh P. Trivedi', email: 'pharm.coord@sspu.edu.in' },
      LAW: { name: 'Prof. Manoj L. Pandya', email: 'law.coord@sspu.edu.in' },
      ENG: { name: 'Dr. Paresh K. Raval', email: 'eng.coord@sspu.edu.in' },
      EDU: { name: 'Prof. Rekha B. Bhatt', email: 'edu.coord@sspu.edu.in' },
    };
    return managers[code] || { name: 'Academic Placement Board', email: 'placements@sspu.edu.in' };
  };

  return (
    <div className="min-h-screen pt-24 bg-dark-50 dark:bg-dark-950 text-dark-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* Page Header */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-dark-900 dark:text-white">
            SSPU Academic <span className="text-gradient">Departments</span>
          </h1>
          <p className="text-sm text-dark-500 dark:text-dark-400 mt-2 max-w-2xl">
            Explore the departments of Shree Saurashtra Patel University. Each department has dedicated coordinators driving customized training, seminars, and placement drives.
          </p>
        </div>

        {/* Departments Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="skeleton h-56 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, index) => {
              const coord = getCoordinator(dept.code);
              return (
                <motion.div
                  key={dept._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-dark-50 dark:bg-dark-850 rounded-2xl flex items-center justify-center border border-dark-100 dark:border-dark-800">
                        {getIcon(dept.code)}
                      </div>
                      <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 text-xs font-bold rounded-xl tracking-wider">
                        {dept.code}
                      </span>
                    </div>

                    <h2 className="text-lg font-display font-bold text-dark-900 dark:text-white mb-2 leading-snug">
                      {dept.name}
                    </h2>
                    <p className="text-xs text-dark-500 dark:text-dark-400 leading-relaxed mb-6">
                      {dept.description || 'Dedicated to offering standard professional curriculum, industry projects, and pre-placement support.'}
                    </p>
                  </div>

                  {/* Coordination Details */}
                  <div className="border-t border-dark-50 dark:border-dark-800/80 pt-4 mt-2">
                    <p className="text-[10px] text-dark-400 uppercase font-bold tracking-wider mb-2">Placement Coordination</p>
                    <div className="flex items-center gap-2 mb-1.5">
                      <HiOutlineUserGroup className="w-4 h-4 text-accent-500" />
                      <span className="text-xs font-bold text-dark-700 dark:text-dark-300">{coord.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiOutlineMail className="w-4 h-4 text-dark-400" />
                      <a href={`mailto:${coord.email}`} className="text-xs text-primary-500 hover:underline">{coord.email}</a>
                    </div>
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

// Simple inline helper import for compilation safety
const HiOutlineTrendingUp = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-9 9-4-4-6 6" />
  </svg>
);

export default Departments;
