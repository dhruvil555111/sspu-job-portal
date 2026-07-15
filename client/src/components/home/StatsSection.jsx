import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Briefcase, Building2, Users, TrendingUp } from 'lucide-react';

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
    { icon: <Briefcase className="w-6 h-6 text-primary-500" />, value: 10000, suffix: '+', label: 'Jobs Posted', color: 'bg-primary-50 dark:bg-primary-950/40' },
    { icon: <Building2 className="w-6 h-6 text-indigo-500" />, value: 5000, suffix: '+', label: 'Verified Companies', color: 'bg-indigo-50 dark:bg-indigo-950/40' },
    { icon: <Users className="w-6 h-6 text-purple-500" />, value: 20000, suffix: '+', label: 'Active Candidates', color: 'bg-purple-50 dark:bg-purple-950/40' },
    { icon: <TrendingUp className="w-6 h-6 text-green-500" />, value: 95, suffix: '%', label: 'Placement Rate', color: 'bg-green-50 dark:bg-green-950/40' },
  ];

  return (
    <section className="py-16 bg-slate-50 dark:bg-dark-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 25 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white dark:bg-dark-900 rounded-2xl p-6 flex items-center gap-5 border border-slate-100 dark:border-dark-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center flex-shrink-0`}>
                {stat.icon}
              </div>
              <div className="text-left">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-none mb-1">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </h3>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
