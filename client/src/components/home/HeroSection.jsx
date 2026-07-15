import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlinePlay } from 'react-icons/hi';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden gradient-hero">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 mb-6">
              <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
              <span className="text-primary-200 text-sm font-medium">Placement Season 2025-26 is Live!</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-white leading-tight mb-6">
              Your Career{' '}
              <span className="relative">
                <span className="text-gradient">Journey</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none"><path d="M2 10C50 2 150 2 198 10" stroke="url(#grad)" strokeWidth="3" strokeLinecap="round"/><defs><linearGradient id="grad"><stop stopColor="#667eea"/><stop offset="1" stopColor="#ec4899"/></linearGradient></defs></svg>
              </span>
              <br />Starts Here
            </h1>

            <p className="text-lg text-dark-300 leading-relaxed mb-8 max-w-lg">
              Connect with 500+ top recruiters. Access exclusive placement drives, internships, and career opportunities tailored for LJ University students.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-12">
              <Link to="/register" className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-2xl shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:scale-105">
                Get Started <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/jobs" className="group inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <HiOutlinePlay className="w-5 h-5" /> Explore Jobs
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-8">
              <div>
                <p className="text-3xl font-display font-bold text-white">500+</p>
                <p className="text-xs text-dark-400 uppercase tracking-wider">Companies</p>
              </div>
              <div className="w-px h-10 bg-dark-600" />
              <div>
                <p className="text-3xl font-display font-bold text-white">10K+</p>
                <p className="text-xs text-dark-400 uppercase tracking-wider">Students Placed</p>
              </div>
              <div className="w-px h-10 bg-dark-600" />
              <div>
                <p className="text-3xl font-display font-bold text-white">45 LPA</p>
                <p className="text-xs text-dark-400 uppercase tracking-wider">Highest Package</p>
              </div>
            </div>
          </motion.div>

          {/* Right side illustration */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block relative">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Floating cards */}
              <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-0 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-2xl w-56">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-success-500/20 flex items-center justify-center"><span className="text-xl">🎉</span></div>
                  <div><p className="text-white text-sm font-semibold">New Offer!</p><p className="text-dark-400 text-xs">Google • 45 LPA</p></div>
                </div>
                <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden"><div className="h-full w-3/4 bg-gradient-to-r from-success-500 to-primary-500 rounded-full" /></div>
              </motion.div>

              <motion.div animate={{ y: [10, -10, 10] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-20 left-0 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-2xl w-52">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center"><span className="text-xl">💼</span></div>
                  <div><p className="text-white text-sm font-semibold">Active Jobs</p><p className="text-primary-300 text-2xl font-bold">247</p></div>
                </div>
              </motion.div>

              <motion.div animate={{ y: [-5, 15, -5] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl w-64">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4 shadow-lg"><span className="text-3xl">🚀</span></div>
                  <p className="text-white font-display font-bold text-lg">Career Connect</p>
                  <p className="text-dark-400 text-sm mt-1">Your gateway to success</p>
                  <div className="flex justify-center gap-1 mt-3">
                    {[...Array(5)].map((_, i) => (<span key={i} className="text-yellow-400 text-sm">★</span>))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full"><path d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z" className="fill-white dark:fill-dark-950" /></svg>
      </div>
    </section>
  );
};

export default HeroSection;
