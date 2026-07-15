import { motion } from 'framer-motion';
import { useState } from 'react';
import { HiOutlineStar, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

const testimonials = [
  { name: 'Priya Sharma', role: 'Software Engineer at Google', dept: 'Computer Engineering', text: 'LJ Career Connect made my placement journey seamless. Got placed at Google with 42 LPA package!', rating: 5, year: '2024' },
  { name: 'Rahul Patel', role: 'Data Scientist at Amazon', dept: 'MCA', text: 'The AI-powered job recommendations helped me find the perfect role. The platform is incredibly user-friendly.', rating: 5, year: '2024' },
  { name: 'Anisha Desai', role: 'Product Manager at Microsoft', dept: 'MBA', text: 'From resume building to interview preparation, LJ Career Connect supported me at every step.', rating: 5, year: '2023' },
  { name: 'Karan Shah', role: 'DevOps Engineer at TCS', dept: 'B.Sc IT', text: 'The placement cell and this portal together created the best placement experience. Highly recommended!', rating: 4, year: '2024' },
];

const Testimonials = () => {
  const [active, setActive] = useState(0);
  const next = () => setActive((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-20 bg-dark-50 dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-semibold rounded-full mb-4">Success Stories</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark-900 dark:text-white">What Our <span className="text-gradient">Alumni Say</span></h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-dark-100 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative">
              <div className="absolute top-4 right-4 text-4xl text-primary-100 dark:text-primary-900/30 font-serif">"</div>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (<HiOutlineStar key={j} className={`w-4 h-4 ${j < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-dark-300'}`} />))}
              </div>
              <p className="text-dark-600 dark:text-dark-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">{t.name.charAt(0)}</div>
                <div>
                  <p className="text-sm font-semibold text-dark-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-dark-500">{t.role}</p>
                  <p className="text-xs text-primary-500">{t.dept} • {t.year}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
