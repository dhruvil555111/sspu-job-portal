import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { HiOutlineUsers, HiOutlineOfficeBuilding, HiOutlineBriefcase, HiOutlineTrendingUp, HiOutlineCurrencyRupee, HiOutlineAcademicCap } from 'react-icons/hi';

const Counter = ({ end, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const StatsSection = () => {
  const stats = [
    { icon: <HiOutlineUsers className="w-7 h-7" />, value: 10000, suffix: '+', label: 'Students Placed', color: 'from-blue-500 to-cyan-400' },
    { icon: <HiOutlineOfficeBuilding className="w-7 h-7" />, value: 500, suffix: '+', label: 'Companies Visited', color: 'from-purple-500 to-pink-400' },
    { icon: <HiOutlineCurrencyRupee className="w-7 h-7" />, value: 45, suffix: ' LPA', label: 'Highest Package', color: 'from-amber-500 to-orange-400' },
    { icon: <HiOutlineTrendingUp className="w-7 h-7" />, value: 8.5, suffix: ' LPA', label: 'Average Package', color: 'from-emerald-500 to-teal-400' },
    { icon: <HiOutlineBriefcase className="w-7 h-7" />, value: 250, suffix: '+', label: 'Active Openings', color: 'from-rose-500 to-red-400' },
    { icon: <HiOutlineAcademicCap className="w-7 h-7" />, value: 18, suffix: '+', label: 'Departments', color: 'from-indigo-500 to-violet-400' },
  ];

  return (
    <section className="py-20 bg-white dark:bg-dark-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-semibold rounded-full mb-4">Placement Statistics</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark-900 dark:text-white">Numbers That Speak <span className="text-gradient">Excellence</span></h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="group relative bg-white dark:bg-dark-800 rounded-2xl p-6 text-center border border-dark-100 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <p className="text-2xl sm:text-3xl font-display font-bold text-dark-900 dark:text-white mb-1">
                <Counter end={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs sm:text-sm text-dark-500 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
