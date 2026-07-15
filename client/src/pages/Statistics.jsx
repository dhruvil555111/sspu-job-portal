import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { publicAPI } from '../services/api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { HiOutlineBadgeCheck, HiOutlineTrendingUp, HiOutlineOfficeBuilding, HiOutlineUserGroup } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Statistics = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    activeJobs: 0,
    studentsPlaced: 0,
    highestPackage: 45,
    averagePackage: 8.5
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await publicAPI.getStats();
        if (data.success) {
          setStats(prev => ({
            ...prev,
            ...data.stats
          }));
        }
      } catch (error) {
        toast.error('Failed to load placement stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Department-wise stats data
  const deptData = [
    { name: 'Computer Apps', placed: 85, total: 100 },
    { name: 'Engineering', placed: 120, total: 150 },
    { name: 'Management', placed: 55, total: 80 },
    { name: 'Pharmacy', placed: 40, total: 60 },
    { name: 'Applied Sciences', placed: 30, total: 50 },
    { name: 'Architecture', placed: 20, total: 40 },
  ];

  // Year-wise packaging growth trend
  const trendData = [
    { year: '2021', average: 5.2, highest: 24 },
    { year: '2022', average: 6.1, highest: 28 },
    { year: '2023', average: 7.2, highest: 35 },
    { year: '2024', average: 8.1, highest: 42 },
    { year: '2025', average: 8.5, highest: 45 },
  ];

  const successStories = [
    {
      name: 'Rohan Mehta',
      company: 'Google',
      package: '45 LPA',
      dept: 'B.E. Computer Engineering',
      img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      quote: 'The mock interview drills and technical coding training at LJ Cell helped me confidently clear Google interviews.',
    },
    {
      name: 'Nisha Shah',
      company: 'Amazon',
      package: '32 LPA',
      dept: 'MCA',
      img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      quote: 'My coordinator guided me to apply at Amazon drives. The entire process was seamless and incredibly professional.',
    },
    {
      name: 'Amit Patel',
      company: 'TCS',
      package: '7.5 LPA',
      dept: 'MBA - Business Analytics',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      quote: 'The personality development workshops and communication classes really polished my soft skills before placement.',
    },
  ];

  const cards = [
    { title: 'Students Placed', value: stats.studentsPlaced || '1,248', desc: 'Placed in last academic year', icon: <HiOutlineBadgeCheck className="w-8 h-8 text-primary-500" /> },
    { title: 'Highest Package', value: `${stats.highestPackage} LPA`, desc: 'Offered by global tech firm', icon: <HiOutlineTrendingUp className="w-8 h-8 text-pink-500" /> },
    { title: 'Recruitment Partners', value: stats.totalCompanies || '350+', desc: 'Companies visited this season', icon: <HiOutlineOfficeBuilding className="w-8 h-8 text-purple-500" /> },
    { title: 'Average Package', value: `${stats.averagePackage} LPA`, desc: 'Consolidated across branches', icon: <HiOutlineUserGroup className="w-8 h-8 text-green-500" /> },
  ];

  return (
    <div className="min-h-screen pt-24 bg-dark-50 dark:bg-dark-950 text-dark-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* Title */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-dark-900 dark:text-white">
            Placement Statistics & Success Stories
          </h1>
          <p className="text-sm text-dark-500 dark:text-dark-400 mt-2 max-w-xl">
            Real figures, real growth. Explore the continuous progress of our students and our premium placement records.
          </p>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-6 shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-dark-500 dark:text-dark-400 font-semibold">{card.title}</span>
                {card.icon}
              </div>
              <h2 className="text-3xl font-display font-bold text-dark-900 dark:text-white">{card.value}</h2>
              <p className="text-xs text-dark-400 mt-1">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Graphical Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Department performance */}
          <div className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-6 shadow-md">
            <h3 className="text-base font-display font-bold text-dark-900 dark:text-white mb-6">
              Department-wise Placement Analysis
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', background: '#1e293b', border: 'none', color: '#fff' }} />
                  <Bar dataKey="placed" name="Placed Students" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="total" name="Total Students" fill="#cbd5e1" radius={[4, 4, 0, 0]} opacity={0.4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Package Growth */}
          <div className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-6 shadow-md">
            <h3 className="text-base font-display font-bold text-dark-900 dark:text-white mb-6">
              Package Growth (2021 - 2025)
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', background: '#1e293b', border: 'none', color: '#fff' }} />
                  <defs>
                    <linearGradient id="colorHighest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="highest" name="Highest (LPA)" stroke="#ec4899" fillOpacity={1} fill="url(#colorHighest)" strokeWidth={2} />
                  <Area type="monotone" dataKey="average" name="Average (LPA)" stroke="#6366f1" fillOpacity={1} fill="url(#colorAvg)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Success Stories Slider */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-dark-900 dark:text-white">
            Alumni Success Stories
          </h2>
          <p className="text-xs text-dark-500 max-w-sm mx-auto mt-2">
            Inspirational words from our placed graduates working in high-growth industries.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {successStories.map((story, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.15 }}
              className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-6 shadow-md flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl text-primary-500 font-display font-bold">“</span>
                <p className="text-xs text-dark-600 dark:text-dark-350 italic leading-relaxed mb-6">
                  {story.quote}
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-dark-50 dark:border-dark-850">
                <img src={story.img} alt={story.name} className="w-10 h-10 rounded-full object-cover border-2 border-primary-500" />
                <div>
                  <h4 className="font-display font-bold text-dark-900 dark:text-white text-xs leading-snug">{story.name}</h4>
                  <p className="text-[10px] text-dark-400 mt-0.5">{story.dept} &bull; Placed at <span className="font-bold text-primary-500">{story.company}</span> ({story.package})</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Statistics;
