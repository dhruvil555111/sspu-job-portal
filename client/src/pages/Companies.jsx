import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { publicAPI } from '../services/api';
import { HiOutlineSearch, HiOutlineLocationMarker, HiOutlineGlobeAlt, HiOutlineOfficeBuilding } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await publicAPI.getCompanies();
        if (data.success) {
          setCompanies(data.companies);
        }
      } catch (error) {
        toast.error('Failed to load companies');
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const industries = ['All', ...new Set(companies.map(c => c.industry).filter(Boolean))];

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.description && company.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesIndustry = selectedIndustry === 'All' || company.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="min-h-screen pt-24 bg-dark-50 dark:bg-dark-950 text-dark-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-dark-900 dark:text-white">
              Our Recruitment Partners
            </h1>
            <p className="text-sm text-dark-500 dark:text-dark-400 mt-2 max-w-xl">
              Meet the global enterprises, startups, and companies that actively recruit student talent from Shree Saurashtra Patel University.
            </p>
          </div>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-64 transition-all"
              />
              <HiOutlineSearch className="w-5 h-5 text-dark-400 absolute left-3 top-2.5" />
            </div>

            {/* Filter */}
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="px-4 py-2 text-sm rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer"
            >
              {industries.map((ind, idx) => (
                <option key={idx} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="skeleton h-56 rounded-2xl" />
            ))}
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-dark-900 rounded-3xl border border-dark-100 dark:border-dark-800">
            <HiOutlineOfficeBuilding className="w-16 h-16 text-dark-300 dark:text-dark-700 mx-auto mb-4" />
            <h3 className="text-lg font-display font-bold text-dark-700 dark:text-dark-300">No Companies Found</h3>
            <p className="text-sm text-dark-400 mt-1">Try resetting your search query or filters.</p>
          </div>
        ) : (
          /* Grid of Companies */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <motion.div
                key={company._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-2xl p-6 shadow-md hover:shadow-xl hover:border-primary-500/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Company Header */}
                  <div className="flex items-center gap-4 mb-4">
                    {company.logo?.url ? (
                      <img src={company.logo.url} alt={company.name} className="w-14 h-14 rounded-xl object-contain bg-dark-50 dark:bg-dark-800 p-1 border border-dark-100 dark:border-dark-850" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg font-display uppercase shadow-inner">
                        {company.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-display font-bold text-dark-900 dark:text-white text-base leading-snug">{company.name}</h3>
                      <span className="badge badge-primary mt-1 text-[10px] uppercase font-semibold">{company.industry || 'Tech Partner'}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <p className="text-xs text-dark-500 dark:text-dark-400 line-clamp-3 mb-4 leading-relaxed">
                    {company.description || 'Global business operations and engineering leader partnering with Shree Saurashtra Patel University placement cells to offer career-launching internships and full-time opportunities.'}
                  </p>
                </div>

                <div>
                  {/* Meta Stats */}
                  <div className="grid grid-cols-2 gap-2 border-t border-b border-dark-100 dark:border-dark-800 py-3 mb-4 text-center">
                    <div>
                      <span className="text-[10px] text-dark-400 dark:text-dark-500 uppercase font-semibold">Total Hires</span>
                      <p className="text-sm font-bold text-dark-900 dark:text-white mt-0.5">{company.totalHires || '12'}+</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-dark-400 dark:text-dark-500 uppercase font-semibold">Highest Package</span>
                      <p className="text-sm font-bold text-primary-500 mt-0.5">{company.highestPackage || '18'} LPA</p>
                    </div>
                  </div>

                  {/* Footer links */}
                  <div className="flex items-center justify-between text-xs text-dark-500 dark:text-dark-450">
                    <span className="flex items-center gap-1">
                      <HiOutlineLocationMarker className="w-4 h-4 text-dark-400" />
                      {company.location?.city ? `${company.location.city}, ${company.location.state || ''}` : 'Gujarat, India'}
                    </span>
                    {company.website && (
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary-500 hover:underline">
                        <HiOutlineGlobeAlt className="w-4 h-4" />
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Companies;
