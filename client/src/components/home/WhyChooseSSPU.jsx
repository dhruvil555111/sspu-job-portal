import { motion } from 'framer-motion';
import { LifeBuoy, ShieldCheck, Zap, FileText, MessageSquare } from 'lucide-react';

const WhyChooseSSPU = () => {
  const features = [
    {
      title: 'Career Support',
      description: 'Get round-the-clock guidance from the TPO placement desk, department coordinators, and alumni mentors.',
      icon: <LifeBuoy className="w-6 h-6 text-primary-500" />,
      color: 'bg-primary-50 dark:bg-primary-950/40 border-primary-100 dark:border-primary-900/40'
    },
    {
      title: 'Verified Employers',
      description: 'Access job postings from 100% vetted and approved companies, ensuring secure, authentic hires.',
      icon: <ShieldCheck className="w-6 h-6 text-indigo-500" />,
      color: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/40'
    },
    {
      title: 'Easy Apply',
      description: 'Submit your pre-built student profile, academic records, and custom cover letters in one click.',
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      color: 'bg-yellow-50 dark:bg-yellow-950/40 border-yellow-100 dark:border-yellow-900/40'
    },
    {
      title: 'Resume Builder',
      description: 'Utilize specialized ATS resume formats to highlights your projects, skills, and academic CGPA.',
      icon: <FileText className="w-6 h-6 text-purple-500" />,
      color: 'bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/40'
    },
    {
      title: 'Interview Tips',
      description: 'Access coding assessment worksheets, system design booklets, and HR behavioral guide sheets.',
      icon: <MessageSquare className="w-6 h-6 text-pink-500" />,
      color: 'bg-pink-50 dark:bg-pink-950/40 border-pink-100 dark:border-pink-900/40'
    }
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-dark-950/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
            Our Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Why Choose <span className="text-primary-500">SSPU Portal</span>
          </h2>
          <p className="text-slate-500 dark:text-dark-400 mt-2 text-sm max-w-lg mx-auto">
            Comprehensive placement cell capabilities mapped inside a single dashboard.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group bg-white dark:bg-dark-900 p-6 rounded-2xl border border-slate-100 dark:border-dark-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-left"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${f.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                {f.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">
                {f.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSSPU;
