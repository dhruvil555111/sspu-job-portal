import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HiOutlineLocationMarker, HiOutlineCurrencyRupee, HiOutlineCalendar, HiOutlineArrowRight } from 'react-icons/hi';

const InternshipOpportunities = () => {
  const navigate = useNavigate();
  const internships = [
    {
      id: 'i1',
      title: 'Full Stack Web Developer Intern',
      company: 'TCS',
      stipend: '₹25,000 / month',
      duration: '6 Months',
      mode: 'Remote',
      skills: ['React', 'Node.js', 'MongoDB'],
      logo: '💻'
    },
    {
      id: 'i2',
      title: 'Data Analyst Intern',
      company: 'Deloitte',
      stipend: '₹20,000 / month',
      duration: '3 Months',
      mode: 'Hybrid',
      skills: ['Python', 'Excel', 'Power BI'],
      logo: '📊'
    },
    {
      id: 'i3',
      title: 'Mobile App Developer Intern',
      company: 'Adobe',
      stipend: '₹30,000 / month',
      duration: '6 Months',
      mode: 'Remote',
      skills: ['Flutter', 'Dart', 'Firebase'],
      logo: '🎨'
    }
  ];

  return (
    <section className="py-20 bg-dark-50 dark:bg-dark-950/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div>
            <span className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
              Summer & Winter Programs
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-dark-900 dark:text-white">
              Internship <span className="text-gradient bg-gradient-to-r from-accent-400 to-pink-500">Opportunities</span>
            </h2>
          </div>
          <button 
            onClick={() => navigate('/jobs?jobType=internship')}
            className="group inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-sm transition-all"
          >
            Explore Internships <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Internships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {internships.map((intern, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/70 dark:bg-dark-900/70 backdrop-blur-md rounded-3xl p-6 border border-dark-100 dark:border-dark-800 shadow-lg hover:shadow-2xl hover:border-accent-500/30 dark:hover:border-accent-500/30 transition-all duration-300 hover:-translate-y-1.5 relative overflow-hidden"
            >
              {/* Highlight ribbon */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent-500/5 dark:bg-accent-500/10 rounded-bl-full flex items-center justify-center pointer-events-none" />

              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-dark-50 dark:bg-dark-800 flex items-center justify-center text-2xl flex-shrink-0">
                  {intern.logo}
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-dark-900 dark:text-white group-hover:text-primary-500 leading-snug">
                    {intern.title}
                  </h3>
                  <p className="text-xs text-dark-400 font-semibold">{intern.company}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-0.5 bg-accent-50 dark:bg-accent-950/40 text-accent-600 dark:text-accent-400 text-[10px] font-bold uppercase rounded-lg border border-accent-100/40 dark:border-accent-900/40">
                  Internship
                </span>
                <span className="px-2.5 py-0.5 bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-300 text-[10px] font-bold uppercase rounded-lg">
                  {intern.mode}
                </span>
              </div>

              {/* Specs */}
              <div className="space-y-2 border-t border-dark-100/50 dark:border-dark-800/50 pt-4 mb-5">
                <p className="flex items-center gap-2 text-xs text-dark-500 dark:text-dark-400">
                  <HiOutlineCurrencyRupee className="w-4 h-4 text-green-500" />
                  <span>Stipend: <strong className="text-green-600 dark:text-green-400">{intern.stipend}</strong></span>
                </p>
                <p className="flex items-center gap-2 text-xs text-dark-500 dark:text-dark-400">
                  <HiOutlineCalendar className="w-4 h-4 text-purple-500" />
                  <span>Duration: <strong>{intern.duration}</strong></span>
                </p>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {intern.skills.map((skill) => (
                  <span 
                    key={skill} 
                    className="px-2 py-0.5 bg-dark-50 dark:bg-dark-800/80 text-dark-600 dark:text-dark-400 text-[10px] rounded-lg font-bold"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <button
                onClick={() => navigate('/register')}
                className="w-full text-center py-2.5 rounded-xl border border-primary-500/50 hover:bg-primary-500 hover:text-white text-primary-600 dark:text-primary-400 font-bold text-xs transition-all active:scale-95"
              >
                Apply Internship
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InternshipOpportunities;
