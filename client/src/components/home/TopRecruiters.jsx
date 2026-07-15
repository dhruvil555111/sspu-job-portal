import { motion } from 'framer-motion';

const recruiters = [
  { name: 'TCS', logo: '🏢' },
  { name: 'Infosys', logo: '💻' },
  { name: 'Wipro', logo: '🌐' },
  { name: 'Accenture', logo: '🔷' },
  { name: 'HCL', logo: '🟢' },
  { name: 'Tech Mahindra', logo: '⚙️' },
  { name: 'L&T Infotech', logo: '🏗️' },
  { name: 'Capgemini', logo: '🔵' }
];

const TopRecruiters = () => {
  return (
    <section className="py-20 bg-white dark:bg-dark-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
            Our Placements Partner
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-dark-900 dark:text-white">
            Top Global <span className="text-gradient">Recruiters</span>
          </h2>
          <p className="text-dark-500 dark:text-dark-400 mt-2 text-sm max-w-lg mx-auto">
            Hiring partners that actively recruit talent from Shree Saurashtra Patel University.
          </p>
        </motion.div>

        {/* Infinite scroll marquee */}
        <div className="relative mt-10">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-dark-900 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-dark-900 to-transparent z-10" />
          
          <motion.div 
            className="flex gap-6 py-4" 
            animate={{ x: ['0%', '-50%'] }} 
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          >
            {[...recruiters, ...recruiters, ...recruiters].map((r, i) => (
              <div 
                key={i} 
                className="flex-shrink-0 w-44 h-24 bg-white dark:bg-dark-800 rounded-3xl flex flex-col items-center justify-center gap-2 border border-dark-100 dark:border-dark-700 hover:border-primary-500/30 dark:hover:border-primary-500/30 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{r.logo}</span>
                <span className="text-xs font-bold text-dark-800 dark:text-dark-200 uppercase tracking-wider">{r.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TopRecruiters;
