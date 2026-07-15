import { motion } from 'framer-motion';

const recruiters = [
  { name: 'TCS', emoji: '🏢' }, { name: 'Infosys', emoji: '💻' }, { name: 'Wipro', emoji: '🌐' },
  { name: 'Amazon', emoji: '📦' }, { name: 'Google', emoji: '🔍' }, { name: 'Microsoft', emoji: '🪟' },
  { name: 'Deloitte', emoji: '📊' }, { name: 'Accenture', emoji: '🔷' }, { name: 'Capgemini', emoji: '🔵' },
  { name: 'IBM', emoji: '🖥️' }, { name: 'Cognizant', emoji: '⚡' }, { name: 'HCL', emoji: '🟢' },
  { name: 'L&T', emoji: '🏗️' }, { name: 'Reliance', emoji: '🛢️' }, { name: 'Adobe', emoji: '🎨' },
  { name: 'Oracle', emoji: '🔴' }, { name: 'SAP', emoji: '💎' }, { name: 'JP Morgan', emoji: '🏦' },
];

const TopRecruiters = () => {
  return (
    <section className="py-20 bg-white dark:bg-dark-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-semibold rounded-full mb-4">Our Partners</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark-900 dark:text-white">Top <span className="text-gradient">Recruiters</span></h2>
          <p className="text-dark-500 mt-3 max-w-lg mx-auto">Industry-leading companies that trust LJ University for their talent acquisition needs.</p>
        </motion.div>

        {/* Infinite scroll marquee */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-dark-950 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-dark-950 to-transparent z-10" />
          
          <motion.div className="flex gap-6 py-4" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}>
            {[...recruiters, ...recruiters].map((r, i) => (
              <div key={i} className="flex-shrink-0 w-40 h-24 bg-dark-50 dark:bg-dark-800 rounded-2xl flex flex-col items-center justify-center gap-2 border border-dark-100 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <span className="text-3xl group-hover:scale-125 transition-transform duration-300">{r.emoji}</span>
                <span className="text-sm font-semibold text-dark-700 dark:text-dark-200">{r.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TopRecruiters;
