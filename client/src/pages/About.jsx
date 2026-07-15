import { motion } from 'framer-motion';
import { HiOutlineAcademicCap, HiOutlineLightBulb, HiOutlineUserGroup, HiOutlineShieldCheck } from 'react-icons/hi';

const About = () => {
  const stats = [
    { label: 'Core Recruiters', value: '350+' },
    { label: 'Annual Placements', value: '1,500+' },
    { label: 'Highest Package', value: '45 LPA' },
    { label: 'Average Package', value: '8.5 LPA' },
  ];

  const coreValues = [
    {
      title: 'Industry Preparedness',
      desc: 'Bridging the skill gap through constant pre-placement workshops, mock coding tests, and HR simulation rounds.',
      icon: <HiOutlineAcademicCap className="w-8 h-8 text-primary-500" />,
    },
    {
      title: 'Opportunity for All',
      desc: 'Ensuring that every qualified student across all 18+ departments gets ample chances to pitch and get placed.',
      icon: <HiOutlineLightBulb className="w-8 h-8 text-pink-500" />,
    },
    {
      title: 'Strong Collaborations',
      desc: 'Cultivating deep-rooted relationships with industry leaders, tech startups, and global enterprises.',
      icon: <HiOutlineUserGroup className="w-8 h-8 text-purple-500" />,
    },
    {
      title: 'Ethical Standards',
      desc: 'Adhering to strict placement guidelines ensuring fairness, transparency, and parity in job offerings.',
      icon: <HiOutlineShieldCheck className="w-8 h-8 text-green-500" />,
    },
  ];

  return (
    <div className="min-h-screen pt-24 bg-dark-50 dark:bg-dark-950 text-dark-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* Banner Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary-900 to-indigo-900 dark:from-dark-900 dark:to-indigo-950 px-8 py-16 md:py-20 text-center shadow-xl mb-12"
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <span className="px-4 py-1.5 bg-white/10 text-white rounded-full text-xs font-semibold uppercase tracking-wider">About Placement Cell</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mt-4 max-w-3xl mx-auto">
            Empowering Careers, Shaping Future Leaders
          </h1>
          <p className="text-dark-200 mt-4 max-w-2xl mx-auto text-base">
            LJ University Central Placement Cell acts as a vital interface between academic excellence and career aspirations, delivering world-class talent to industries globally.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white dark:bg-dark-900 rounded-2xl p-6 text-center border border-dark-100 dark:border-dark-800 shadow-md"
            >
              <h3 className="text-3xl font-display font-bold text-gradient">{stat.value}</h3>
              <p className="text-sm text-dark-500 dark:text-dark-400 mt-2 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Info Blocks */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-display font-bold text-dark-900 dark:text-white mb-6">
              Message from the Training & Placement Officer (TPO)
            </h2>
            <div className="space-y-4 text-dark-600 dark:text-dark-300 leading-relaxed text-sm md:text-base">
              <p>
                "At LJ University, we believe in grooming students not just for professional excellence but to become responsible and proactive builders of society. The Central Placement Cell ensures that our curriculum matches industrial parameters, organizing specialized bootcamps and certifications that help our students stay ahead of the technology curve."
              </p>
              <p>
                "We extend our heartfelt gratitude to our recruitment partners who continue to trust our graduates, and we welcome new partners to explore our campus talent."
              </p>
            </div>
            <div className="mt-6">
              <h4 className="font-display font-bold text-dark-900 dark:text-white">Dr. Manish Shah</h4>
              <p className="text-xs text-primary-500 font-semibold uppercase mt-0.5">Head of Placements, LJ University</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500 to-pink-500 rounded-3xl blur-2xl opacity-10 dark:opacity-20 animate-pulse-glow" />
            <div className="relative bg-white dark:bg-dark-900 rounded-3xl p-8 border border-dark-100 dark:border-dark-800 shadow-xl">
              <h3 className="text-xl font-display font-bold text-dark-900 dark:text-white mb-6">LJ Placement Policy</h3>
              <ul className="space-y-4 text-sm text-dark-600 dark:text-dark-300">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0" />
                  <span><strong>One Student, One Job:</strong> Promotes equal distribution of placement offers.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0" />
                  <span><strong>Dream Offer Eligibility:</strong> Placed students can participate in premium drives offering &gt;1.5x package.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0" />
                  <span><strong>Mandatory Attendance:</strong> Registered students must attend pre-placement talks (PPT).</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Core Values / Work */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-display font-bold text-dark-900 dark:text-white">How We Work</h2>
          <p className="text-dark-500 max-w-lg mx-auto mt-2">Key pillars driving our campus engagement strategy.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((val, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="w-14 h-14 bg-dark-50 dark:bg-dark-800 rounded-xl flex items-center justify-center mb-4">
                {val.icon}
              </div>
              <h3 className="font-display font-bold text-dark-900 dark:text-white text-lg mb-2">{val.title}</h3>
              <p className="text-xs text-dark-500 dark:text-dark-400 leading-relaxed">{val.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default About;
