import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineLocationMarker, HiOutlineClock, HiOutlineCurrencyRupee, HiOutlineBookmark, HiOutlineArrowRight } from 'react-icons/hi';

const sampleJobs = [
  { id: 1, title: 'Software Engineer', company: 'TCS', logo: '🏢', location: 'Mumbai', type: 'Full Time', package: '6-8 LPA', skills: ['Java', 'Spring Boot', 'SQL'], posted: '2 days ago', workMode: 'Hybrid' },
  { id: 2, title: 'Data Analyst Intern', company: 'Infosys', logo: '💻', location: 'Pune', type: 'Internship', package: '25K/month', skills: ['Python', 'SQL', 'Tableau'], posted: '1 day ago', workMode: 'Remote' },
  { id: 3, title: 'Frontend Developer', company: 'Wipro', logo: '🌐', location: 'Bangalore', type: 'Full Time', package: '8-12 LPA', skills: ['React', 'TypeScript', 'CSS'], posted: '3 days ago', workMode: 'Onsite' },
  { id: 4, title: 'Business Analyst', company: 'Deloitte', logo: '📊', location: 'Ahmedabad', type: 'Full Time', package: '7-10 LPA', skills: ['Excel', 'Power BI', 'SQL'], posted: '5 hrs ago', workMode: 'Hybrid' },
  { id: 5, title: 'Cloud Engineer', company: 'Amazon', logo: '☁️', location: 'Hyderabad', type: 'Full Time', package: '18-25 LPA', skills: ['AWS', 'Docker', 'Kubernetes'], posted: '1 day ago', workMode: 'Onsite' },
  { id: 6, title: 'UI/UX Design Intern', company: 'Adobe', logo: '🎨', location: 'Noida', type: 'Internship', package: '30K/month', skills: ['Figma', 'Sketch', 'Prototyping'], posted: '4 days ago', workMode: 'Remote' },
];

const FeaturedJobs = () => {
  return (
    <section className="py-20 bg-dark-50 dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-semibold rounded-full mb-4">Latest Opportunities</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark-900 dark:text-white">Featured <span className="text-gradient">Jobs & Internships</span></h2>
          </div>
          <Link to="/jobs" className="group inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:gap-3 transition-all">
            View All Jobs <HiOutlineArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sampleJobs.map((job, i) => (
            <motion.div key={job.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="group bg-white dark:bg-dark-800 rounded-2xl p-6 border border-dark-100 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden">
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-dark-100 dark:bg-dark-700 flex items-center justify-center text-2xl">
                    {job.logo}
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{job.title}</h3>
                    <p className="text-sm text-dark-500">{job.company}</p>
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 text-dark-400 hover:text-primary-500 transition-all">
                  <HiOutlineBookmark className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="badge badge-primary">{job.type}</span>
                <span className="badge bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-300">{job.workMode}</span>
              </div>

              <div className="space-y-2 mb-4">
                <p className="flex items-center gap-2 text-sm text-dark-500"><HiOutlineLocationMarker className="w-4 h-4" /> {job.location}</p>
                <p className="flex items-center gap-2 text-sm text-dark-500"><HiOutlineCurrencyRupee className="w-4 h-4" /> {job.package}</p>
                <p className="flex items-center gap-2 text-sm text-dark-400"><HiOutlineClock className="w-4 h-4" /> {job.posted}</p>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {job.skills.map(skill => (
                  <span key={skill} className="px-2.5 py-1 bg-dark-50 dark:bg-dark-700 text-dark-600 dark:text-dark-300 text-xs rounded-lg font-medium">{skill}</span>
                ))}
              </div>

              <Link to={`/jobs/${job.id}`} className="block w-full text-center py-2.5 rounded-xl border-2 border-primary-500 text-primary-600 dark:text-primary-400 font-semibold text-sm hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 dark:hover:text-white transition-all duration-300">
                View Details
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
