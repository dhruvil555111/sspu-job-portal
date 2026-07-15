import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { aiAPI } from '../services/api';
import { HiOutlineSparkles, HiOutlineCheckCircle, HiOutlineExclamation, HiOutlineTrendingUp, HiOutlineBriefcase } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AITools = () => {
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const fetchAIData = async () => {
    try {
      const [analysisRes, recRes] = await Promise.all([
        aiAPI.analyzeResume(),
        aiAPI.getRecommendations(),
      ]);
      if (analysisRes.data.success) setAnalysis(analysisRes.data);
      if (recRes.data.success) setRecommendations(recRes.data.recommendations || []);
    } catch (error) {
      toast.error('Could not fetch profile analysis. Please complete your academic details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIData();
  }, []);

  const triggerAnalysis = () => {
    setAnalyzing(true);
    setTimeout(async () => {
      await fetchAIData();
      setAnalyzing(false);
      toast.success('Profile analysis updated successfully!');
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-24 bg-dark-50 dark:bg-dark-950 text-dark-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* Title */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-dark-900 dark:text-white flex items-center gap-2">
              <HiOutlineSparkles className="w-8 h-8 text-primary-500 animate-pulse" /> AI Placement Assistant
            </h1>
            <p className="text-sm text-dark-500 dark:text-dark-400 mt-2 max-w-xl">
              Leverage custom algorithms to analyze profile readiness, score your resume, and match with open jobs.
            </p>
          </div>
          
          <button
            onClick={triggerAnalysis}
            disabled={analyzing || loading}
            className="btn-primary text-xs py-2.5 shrink-0 flex items-center gap-2"
          >
            <HiOutlineSparkles className="w-4 h-4" />
            {analyzing ? 'Recalculating Score...' : 'Analyze Resume Profile'}
          </button>
        </div>

        {loading ? (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="skeleton h-96 rounded-3xl lg:col-span-1" />
            <div className="skeleton h-96 rounded-3xl lg:col-span-2" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            
            {/* Scorecard panel */}
            <div className="lg:col-span-1 bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-6 shadow-md text-center">
              <span className="text-xs text-dark-400 uppercase font-bold tracking-wider">Profile Score</span>
              
              {/* Circular score display */}
              <div className="relative w-36 h-36 mx-auto my-6 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="60" className="stroke-dark-100 dark:stroke-dark-800" strokeWidth="12" fill="transparent" />
                  <circle cx="72" cy="72" r="60" className="stroke-primary-500" strokeWidth="12" fill="transparent"
                    strokeDasharray={2 * Math.PI * 60}
                    strokeDashoffset={2 * Math.PI * 60 * (1 - (analysis?.score || 0) / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-4xl font-display font-extrabold text-dark-900 dark:text-white">{analysis?.score || 0}</span>
                  <span className="text-dark-450 block text-[10px] uppercase font-bold mt-0.5">Rating: {analysis?.rating || 'Bronze'}</span>
                </div>
              </div>

              {/* Quick indicators */}
              <div className="grid grid-cols-3 gap-2 border-t border-dark-50 dark:border-dark-850 pt-4 text-center text-xs">
                <div>
                  <span className="text-dark-400 block text-[10px] font-semibold">SKILLS</span>
                  <span className="font-bold text-dark-900 dark:text-white mt-0.5">{analysis?.metrics?.skillsCount || 0}</span>
                </div>
                <div>
                  <span className="text-dark-400 block text-[10px] font-semibold">PROJECTS</span>
                  <span className="font-bold text-dark-900 dark:text-white mt-0.5">{analysis?.metrics?.projectsCount || 0}</span>
                </div>
                <div>
                  <span className="text-dark-400 block text-[10px] font-semibold">RESUME</span>
                  <span className={`font-bold mt-0.5 ${analysis?.metrics?.hasResume ? 'text-green-500' : 'text-red-500'}`}>
                    {analysis?.metrics?.hasResume ? 'YES' : 'NO'}
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendations & Action Plan */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Recommendations list */}
              <div className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-6 shadow-md">
                <h3 className="font-display font-bold text-dark-900 dark:text-white text-base mb-4 flex items-center gap-2">
                  <HiOutlineTrendingUp className="w-5 h-5 text-primary-500" /> Action Items to Improve Resume Score
                </h3>
                
                <div className="space-y-3.5">
                  {analysis?.recommendations?.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-dark-50/50 dark:bg-dark-950/40 p-3.5 rounded-2xl border border-dark-100 dark:border-dark-850">
                      {analysis.score >= 85 ? (
                        <HiOutlineCheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      ) : (
                        <HiOutlineExclamation className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      )}
                      <p className="text-xs text-dark-700 dark:text-dark-300 leading-relaxed font-medium">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommended Jobs */}
              <div className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-6 shadow-md">
                <h3 className="font-display font-bold text-dark-900 dark:text-white text-base mb-4 flex items-center gap-2">
                  <HiOutlineSparkles className="w-5 h-5 text-pink-500 animate-pulse" /> Compatible Job Openings
                </h3>

                {recommendations.length === 0 ? (
                  <div className="text-center py-8">
                    <HiOutlineBriefcase className="w-12 h-12 text-dark-300 dark:text-dark-700 mx-auto mb-2" />
                    <p className="text-xs text-dark-400">Complete your profile skills and departments to view AI recommendations.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recommendations.map(({ job, matchScore, matchBreakdown }) => (
                      <div key={job._id} className="p-4 rounded-2xl border border-dark-100 dark:border-dark-800 hover:border-primary-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {job.company?.logo?.url ? (
                            <img src={job.company.logo.url} alt={job.company.name} className="w-10 h-10 rounded-lg object-contain bg-dark-50 dark:bg-dark-850 p-1" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-pink-500 flex items-center justify-center text-white font-bold text-sm">
                              {job.company?.name?.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-dark-900 dark:text-white text-xs leading-snug">{job.title}</h4>
                            <p className="text-[10px] text-dark-450 mt-0.5">{job.company?.name} &bull; {job.location || 'Ahmedabad'} &bull; {job.package?.max || 0} LPA</p>
                          </div>
                        </div>

                        {/* Match Progress */}
                        <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
                          <div className="text-right">
                            <span className="text-[10px] text-dark-400 block font-semibold">Match Score</span>
                            <span className="text-xs font-bold text-primary-500">{matchScore}% Match</span>
                          </div>
                          <div className="w-20 bg-dark-100 dark:bg-dark-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-primary-500 to-pink-500 h-full" style={{ width: `${matchScore}%` }} />
                          </div>
                          <a href={`/jobs`} className="px-3.5 py-1.5 bg-dark-50 dark:bg-dark-800 text-dark-700 dark:text-dark-200 hover:bg-primary-600 hover:text-white transition-all text-[10px] font-bold rounded-lg border border-dark-100 dark:border-dark-750">
                            Apply
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AITools;
