import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Laptop, Megaphone, Coins, GraduationCap, Settings, HeartPulse, Landmark, Briefcase } from 'lucide-react';

const PopularCategories = () => {
  const navigate = useNavigate();
  const categories = [
    { name: 'IT & Software', icon: <Laptop className="w-6 h-6 text-blue-500" />, count: '1200+ Jobs', slug: 'cs' },
    { name: 'Marketing', icon: <Megaphone className="w-6 h-6 text-purple-500" />, count: '450+ Jobs', slug: 'mgmt' },
    { name: 'Finance', icon: <Coins className="w-6 h-6 text-yellow-500" />, count: '320+ Jobs', slug: 'comm' },
    { name: 'Education', icon: <GraduationCap className="w-6 h-6 text-emerald-500" />, count: '280+ Jobs', slug: 'edu' },
    { name: 'Engineering', icon: <Settings className="w-6 h-6 text-orange-500" />, count: '890+ Jobs', slug: 'eng' },
    { name: 'Healthcare', icon: <HeartPulse className="w-6 h-6 text-rose-500" />, count: '150+ Jobs', slug: 'pharm' },
    { name: 'Government', icon: <Landmark className="w-6 h-6 text-cyan-500" />, count: '90+ Jobs', slug: 'law' },
    { name: 'Management', icon: <Briefcase className="w-6 h-6 text-indigo-500" />, count: '670+ Jobs', slug: 'mgmt' }
  ];

  const handleCategoryClick = (slug) => {
    navigate(`/jobs?department=${slug}`);
  };

  return (
    <section className="py-20 bg-white dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
            Popular Sectors
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Explore By <span className="text-primary-500">Popular Categories</span>
          </h2>
          <p className="text-slate-500 dark:text-dark-400 mt-2 text-sm max-w-lg mx-auto">
            Browse placements, job postings, and internships across core sectors.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleCategoryClick(c.slug)}
              className="group bg-slate-50 dark:bg-dark-800 p-6 rounded-2xl border border-transparent hover:border-primary-500/20 dark:hover:border-primary-500/20 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer text-left"
            >
              <div className="w-12 h-12 bg-white dark:bg-dark-900 rounded-xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                {c.icon}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base group-hover:text-primary-500 transition-colors">
                {c.name}
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                {c.count}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
