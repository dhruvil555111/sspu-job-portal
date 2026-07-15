import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';
import { FaLinkedinIn, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const quickLinks = [
    { name: 'Browse Jobs', path: '/jobs' },
    { name: 'Departments', path: '/departments' },
    { name: 'Companies', path: '/companies' },
    { name: 'Placement Drives', path: '/placement-drives' },
    { name: 'Training Programs', path: '/training' },
  ];
  const forStudents = [
    { name: 'Register', path: '/register' },
    { name: 'Student Dashboard', path: '/student/dashboard' },
    { name: 'My Applications', path: '/student/applications' },
    { name: 'Career Guidance', path: '/career-guidance' },
    { name: 'Resume Builder', path: '/resume-builder' },
  ];
  const forRecruiters = [
    { name: 'Company Registration', path: '/register?role=recruiter' },
    { name: 'Post a Job', path: '/recruiter/post-job' },
    { name: 'Search Students', path: '/recruiter/students' },
    { name: 'Recruiter Dashboard', path: '/recruiter/dashboard' },
  ];

  return (
    <footer className="bg-dark-900 text-white relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl font-display">LJ</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-xl">Career Connect</h3>
                <p className="text-xs text-primary-400 tracking-wider uppercase">LJ University</p>
              </div>
            </Link>
            <p className="text-dark-400 text-sm leading-relaxed mb-5">Empowering students with world-class placement opportunities. Connecting talent with top recruiters across India.</p>
            <div className="space-y-2.5">
              <a href="mailto:placement@ljku.edu.in" className="flex items-center gap-3 text-dark-400 hover:text-primary-400 transition-colors text-sm"><HiOutlineMail className="w-4 h-4" /> placement@ljku.edu.in</a>
              <a href="tel:+911234567890" className="flex items-center gap-3 text-dark-400 hover:text-primary-400 transition-colors text-sm"><HiOutlinePhone className="w-4 h-4" /> 1800-121-0082</a>
              <p className="flex items-center gap-3 text-dark-400 text-sm"><HiOutlineLocationMarker className="w-4 h-4" /> Ahmedabad, Gujarat, India</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-5 text-white">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.path}><Link to={link.path} className="text-dark-400 hover:text-primary-400 transition-colors text-sm hover:translate-x-1 inline-block">{link.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* For Students */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-5 text-white">For Students</h4>
            <ul className="space-y-2.5">
              {forStudents.map(link => (
                <li key={link.path}><Link to={link.path} className="text-dark-400 hover:text-primary-400 transition-colors text-sm hover:translate-x-1 inline-block">{link.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* For Recruiters */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-5 text-white">For Recruiters</h4>
            <ul className="space-y-2.5">
              {forRecruiters.map(link => (
                <li key={link.path}><Link to={link.path} className="text-dark-400 hover:text-primary-400 transition-colors text-sm hover:translate-x-1 inline-block">{link.name}</Link></li>
              ))}
            </ul>
            <div className="flex items-center gap-3 mt-6">
              {[FaLinkedinIn, FaTwitter, FaInstagram, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-dark-800 hover:bg-primary-600 flex items-center justify-center text-dark-400 hover:text-white transition-all duration-300"><Icon className="w-4 h-4" /></a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-dark-500 text-sm">© {currentYear} LJ Career Connect. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-dark-500">
            <Link to="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-primary-400 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
