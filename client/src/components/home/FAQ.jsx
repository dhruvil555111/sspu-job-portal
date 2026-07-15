import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineAcademicCap } from 'react-icons/hi';
import { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    { q: 'How do I register on SSPU Career Connect?', a: 'Click the Register button, select your role (Student/Recruiter), fill in your details, verify your email with OTP, and complete your profile to start applying.' },
    { q: 'Which departments are eligible for placements?', a: 'All departments of Shree Saurashtra Patel University are eligible including Computer Science, Information Technology, Commerce, Management, Arts, Science, Pharmacy, Law, Engineering, and Education.' },
    { q: 'How can recruiters post job openings?', a: 'Recruiters can register their company, get verified by the placement cell, and then post jobs/internships directly through their dashboard.' },
    { q: 'What is the placement process?', a: 'Companies register → Jobs are posted → Students apply → TPO approves → Shortlisting → Interviews → Selection → Offer Letters. Everything is managed through the portal.' },
    { q: 'Can alumni access the portal?', a: 'Yes! Alumni can register, update their profiles, and access job opportunities. They can also contribute as mentors and share success stories.' },
  ];

  return (
    <section className="py-20 bg-white dark:bg-dark-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-semibold rounded-full mb-4">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark-900 dark:text-white">Frequently Asked <span className="text-gradient">Questions</span></h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="bg-dark-50 dark:bg-dark-800 rounded-2xl border border-dark-100 dark:border-dark-700 overflow-hidden">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-semibold text-dark-900 dark:text-white text-sm sm:text-base pr-4">{faq.q}</span>
                <span className={`flex-shrink-0 w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 transition-transform duration-300 ${openIndex === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              <motion.div initial={false} animate={{ height: openIndex === i ? 'auto' : 0, opacity: openIndex === i ? 1 : 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                <p className="px-5 pb-5 text-dark-500 text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-500/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 border border-white/10">
            <HiOutlineAcademicCap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white mb-6">Ready to Launch Your <span className="text-gradient">Career?</span></h2>
          <p className="text-dark-300 text-lg mb-10 max-w-2xl mx-auto">Join thousands of Shree Saurashtra Patel University students who have already found their dream jobs through Career Connect.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/register" className="group inline-flex items-center gap-2 px-10 py-4 bg-white text-primary-700 font-bold rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:scale-105">
              Register Now <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/jobs" className="inline-flex items-center gap-2 px-10 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              Browse Jobs
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export { FAQ, CTASection };
