import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Sparkles, GraduationCap, Briefcase, Users } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = [];
    if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
    if (location) queryParams.push(`location=${encodeURIComponent(location)}`);
    navigate(`/jobs${queryParams.length > 0 ? '?' + queryParams.join('&') : ''}`);
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center bg-slate-50 dark:bg-dark-950 overflow-hidden pt-28 pb-16">
      
      {/* Animated background shapes */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left: Text Content & Search */}
        <div className="lg:col-span-7 text-left space-y-6">
          
          {/* Tag */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 dark:bg-primary-950/40 rounded-full border border-primary-100 dark:border-primary-900/40"
          >
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span className="text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-wider">SSPU CAREER CONNECT PORTAL</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight"
          >
            Find Your <span className="text-primary-500">Dream Job</span>
            <br />
            & Build Your Future
          </motion.h1>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 dark:text-dark-400 text-sm sm:text-base max-w-lg leading-relaxed"
          >
            Connecting the graduates of Shree Saurashtra Patel University with elite global companies, verified startups, and direct placement opportunities.
          </motion.p>

          {/* Search Bar Form - Glassmorphism style card */}
          <motion.form 
            onSubmit={handleSearchSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-dark-900 p-4 rounded-2xl border border-slate-100 dark:border-dark-800 shadow-xl grid grid-cols-1 sm:grid-cols-12 gap-3 max-w-2xl"
          >
            {/* Keyword Input */}
            <div className="sm:col-span-5 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Job title, keywords, or company..."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-dark-800 rounded-xl text-xs font-semibold border border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white placeholder-slate-400 transition-all"
              />
            </div>

            {/* Location Input */}
            <div className="sm:col-span-4 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or 'Remote'..."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-dark-800 rounded-xl text-xs font-semibold border border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white placeholder-slate-400 transition-all"
              />
            </div>

            {/* Search Button */}
            <div className="sm:col-span-3">
              <button
                type="submit"
                className="w-full h-full py-2.5 bg-primary-500 hover:bg-primary-600 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
              >
                Search Jobs
              </button>
            </div>
          </motion.form>

          {/* Quick stats tags */}
          <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
            <span>Popular:</span>
            <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => setSearch('React')}>React</span>
            <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => setSearch('Python')}>Python</span>
            <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => setSearch('Internship')}>Internships</span>
          </div>

        </div>

        {/* Right: Graphic Mockup representing student placements */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          
          {/* Main graphics container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-sm aspect-square bg-gradient-to-br from-primary-500 to-indigo-600 rounded-3xl p-8 relative flex flex-col justify-end text-left text-white shadow-2xl overflow-hidden"
          >
            {/* Background elements */}
            <div className="absolute top-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl" />
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-indigo-900/20 rounded-full blur-xl" />
            
            {/* Dynamic Card Overlay */}
            <div className="absolute top-8 left-8 right-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-600 text-lg font-bold">
                  🎓
                </div>
                <div>
                  <h4 className="font-bold text-xs">Priya Sharma</h4>
                  <p className="text-[10px] text-slate-200">MCA CS • Class of 2026</p>
                </div>
              </div>
              <div className="mt-3 flex gap-1.5 flex-wrap">
                <span className="text-[8px] font-bold bg-green-500/20 text-green-300 px-2 py-0.5 rounded">Placed at Microsoft</span>
                <span className="text-[8px] font-bold bg-white/10 text-white px-2 py-0.5 rounded">32 LPA</span>
              </div>
            </div>

            {/* Candidate Stats Overlay */}
            <div className="absolute bottom-32 right-8 bg-white text-slate-800 rounded-2xl p-3 border border-slate-100 shadow-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-500">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Placement Rate</p>
                <h4 className="text-sm font-extrabold text-slate-900">95% Success</h4>
              </div>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 space-y-2 mt-auto">
              <span className="px-2.5 py-0.5 bg-white/20 text-white rounded text-[10px] uppercase font-bold tracking-wider">Placement Drive</span>
              <h3 className="text-xl font-bold font-display">SSPU Placement Drive 2026</h3>
              <p className="text-xs text-slate-200">Connect directly with companies visiting campus next month.</p>
            </div>
          </motion.div>
          
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
