import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HiOutlineCalendar, HiOutlineAcademicCap, HiOutlineCurrencyRupee, HiOutlineCheckCircle } from 'react-icons/hi';

const UpcomingDrivesSection = () => {
  const navigate = useNavigate();
  const drives = [
    {
      company: 'Microsoft',
      date: 'July 28, 2026',
      eligibility: 'B.Tech CS/IT (CGPA >= 8.0)',
      package: '24-32 LPA',
      deadline: 'July 24, 2026',
      logo: '💻',
      status: 'Open'
    },
    {
      company: 'TCS Digital',
      date: 'August 05, 2026',
      eligibility: 'All Engineering, CS & MCA (CGPA >= 7.0)',
      package: '7-9 LPA',
      deadline: 'July 30, 2026',
      logo: '🏢',
      status: 'Open'
    },
    {
      company: 'Accenture',
      date: 'August 12, 2026',
      eligibility: 'B.Tech, MCA, MBA (CGPA >= 6.5)',
      package: '6.5 LPA',
      deadline: 'August 05, 2026',
      logo: '🔷',
      status: 'Open'
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-dark-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div>
            <span className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
              Drives Schedule
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-dark-900 dark:text-white">
              Upcoming <span className="text-gradient">Placement Drives</span>
            </h2>
          </div>
          <button 
            onClick={() => navigate('/placement-drives')}
            className="text-primary-600 dark:text-primary-400 font-bold hover:underline text-sm flex items-center gap-1 active:scale-95 transition-transform"
          >
            View All Drives &rarr;
          </button>
        </motion.div>

        {/* Drives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {drives.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-white/70 dark:bg-dark-900/70 backdrop-blur-md rounded-3xl p-6 border border-dark-100 dark:border-dark-800 shadow-lg hover:shadow-2xl hover:border-primary-500/20 dark:hover:border-primary-500/20 transition-all duration-300 hover:-translate-y-1.5"
            >
              {/* Top Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-dark-100 dark:bg-dark-800 flex items-center justify-center text-2xl">
                    {d.logo}
                  </div>
                  <div>
                    <h3 className="font-bold text-dark-900 dark:text-white group-hover:text-primary-500 transition-colors">
                      {d.company}
                    </h3>
                    <p className="text-xs text-dark-400">Campus Placement</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-2.5 py-1 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  {d.status}
                </span>
              </div>

              {/* Specs */}
              <div className="space-y-3 my-6 border-t border-b border-dark-100/50 dark:border-dark-800/50 py-4">
                <div className="flex items-center gap-2 text-xs text-dark-500 dark:text-dark-400">
                  <HiOutlineCalendar className="w-4 h-4 text-primary-500" />
                  <span>Drive Date: <strong>{d.date}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-dark-500 dark:text-dark-400">
                  <HiOutlineAcademicCap className="w-4 h-4 text-purple-500" />
                  <span>Eligibility: <strong>{d.eligibility}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-dark-500 dark:text-dark-400">
                  <HiOutlineCurrencyRupee className="w-4 h-4 text-pink-500" />
                  <span>CTC Package: <strong className="text-primary-600 dark:text-primary-400">{d.package}</strong></span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-[10px] text-dark-400 font-bold uppercase tracking-wider">
                  Deadline: <span className="text-red-500">{d.deadline}</span>
                </div>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-600 text-white font-bold text-xs rounded-xl shadow-md group-hover:scale-105 active:scale-95 transition-all"
                >
                  Register Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingDrivesSection;
