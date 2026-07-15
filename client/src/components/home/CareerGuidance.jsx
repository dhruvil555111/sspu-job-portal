import { motion } from 'framer-motion';
import { HiOutlineDocumentText, HiOutlineCode, HiOutlineChatAlt2, HiOutlineBookOpen } from 'react-icons/hi';

const CareerGuidance = () => {
  const guides = [
    {
      title: 'ATS-Friendly Resume Guide',
      description: 'Format your accomplishments using structure, parseable grids, and industry action verbs to secure higher screening match rates.',
      icon: <HiOutlineDocumentText className="w-6 h-6 text-primary-500" />,
      tag: 'Resume Tips'
    },
    {
      title: 'Data Structures & Algorithms Prep',
      description: 'Practice coding worksheets on OOPs, arrays, lists, dynamic programming, and binary trees curated for product-company rounds.',
      icon: <HiOutlineCode className="w-6 h-6 text-purple-500" />,
      tag: 'Coding Assessment'
    },
    {
      title: 'Cracking the HR Panel Round',
      description: 'Understand the STAR method for behavioral questions, formulate responses, and prepare answers for standard situation prompts.',
      icon: <HiOutlineChatAlt2 className="w-6 h-6 text-pink-500" />,
      tag: 'Behavioral Skills'
    },
    {
      title: 'Core CS Subject Quick Sheets',
      description: 'Summaries of Database Management Systems, SQL commands, Computer Network basics, Operating Systems, and System Design notes.',
      icon: <HiOutlineBookOpen className="w-6 h-6 text-green-500" />,
      tag: 'Technical Topics'
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-dark-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
            Preparation Library
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-dark-900 dark:text-white">
            Placement Prep & <span className="text-gradient">Career Guidance</span>
          </h2>
          <p className="text-dark-500 dark:text-dark-400 mt-2 text-sm max-w-lg mx-auto">
            Resource sheets compiled by SSPU experts to help you excel during critical interview phases.
          </p>
        </motion.div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white/70 dark:bg-dark-900/70 backdrop-blur-md rounded-3xl p-6 border border-dark-100 dark:border-dark-800 shadow-md hover:shadow-xl hover:border-primary-500/20 dark:hover:border-primary-500/20 transition-all duration-300 hover:-translate-y-1.5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-dark-50 dark:bg-dark-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {g.icon}
                </div>
                <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 px-2 py-0.5 rounded-md">
                  {g.tag}
                </span>
              </div>
              <h3 className="font-bold text-sm sm:text-base text-dark-900 dark:text-white mb-2 leading-tight">
                {g.title}
              </h3>
              <p className="text-xs text-dark-500 dark:text-dark-400 leading-relaxed mb-4">
                {g.description}
              </p>
              <a 
                href="/training-programs" 
                className="text-xs font-bold text-primary-500 hover:text-primary-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              >
                Read Article &rarr;
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareerGuidance;
