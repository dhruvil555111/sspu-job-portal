import Student from '../models/Student.js';
import Job from '../models/Job.js';

// @desc    Analyze profile & resume to calculate a Resume Score
// @route   POST /api/ai/analyze-resume
// @access  Private (Student)
export const analyzeResume = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id }).populate('department');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    let score = 20; // Base score for registration
    const recommendations = [];

    // Personal Details check
    if (student.portfolio || student.github || student.linkedin) {
      score += 10;
    } else {
      recommendations.push('Add online profile links (LinkedIn, GitHub, or Portfolio) to build web presence.');
    }

    // Academics check
    if (student.cgpa) {
      score += 15;
      if (student.cgpa < 6.5) {
        recommendations.push('Your CGPA is below 6.5. Focus on academic improvements to meet eligibility criteria for premium recruiters.');
      }
    } else {
      recommendations.push('Complete your academic profile by adding your CGPA.');
    }

    // Skills check
    if (student.skills && student.skills.length > 0) {
      const skillPoints = Math.min(student.skills.length * 3, 20);
      score += skillPoints;
      if (student.skills.length < 5) {
        recommendations.push('List at least 5 core technical skills to highlight your strengths.');
      }
    } else {
      recommendations.push('Add technical and soft skills to improve your resume search hits.');
    }

    // Projects check
    if (student.projects && student.projects.length > 0) {
      const projectPoints = Math.min(student.projects.length * 5, 15);
      score += projectPoints;
      const missingRepos = student.projects.some(p => !p.github);
      if (missingRepos) {
        recommendations.push('Attach GitHub repository links to your projects to validate your work.');
      }
    } else {
      recommendations.push('Add academic or personal projects showcasing real-world application of your skills.');
    }

    // Certifications check
    if (student.certificates && student.certificates.length > 0) {
      score += 10;
    } else {
      recommendations.push('List valid technical certifications or workshops to stand out.');
    }

    // Resume PDF upload check
    if (student.resume && student.resume.url) {
      score += 10;
    } else {
      recommendations.push('Upload your official PDF resume to enable quick applications.');
    }

    // Cap the score at 100
    score = Math.min(score, 100);

    // Dynamic rating category
    let rating = 'Bronze';
    if (score >= 85) rating = 'Platinum';
    else if (score >= 70) rating = 'Gold';
    else if (score >= 50) rating = 'Silver';

    res.status(200).json({
      success: true,
      score,
      rating,
      recommendations: recommendations.length > 0 ? recommendations : ['Excellent! Your profile and resume score is top-notch. Keep it updated.'],
      metrics: {
        skillsCount: student.skills?.length || 0,
        projectsCount: student.projects?.length || 0,
        hasResume: !!student.resume?.url,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get smart job recommendations based on matching skills, branch, and CGPA
// @route   GET /api/ai/job-recommendations
// @access  Private (Student)
export const getJobRecommendations = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    // Fetch all active, approved jobs
    const jobs = await Job.find({
      status: 'active',
      isApprovedByTPO: true,
      deadline: { $gte: new Date() },
    }).populate('company', 'name logo location industry');

    const recommendedJobs = [];

    for (const job of jobs) {
      let matchScore = 0;
      const matchBreakdown = { branch: 0, cgpa: 0, skills: 0 };

      // 1. Branch/Department Match (Weight: 40%)
      const isEligibleDept = job.eligibility?.departments?.length === 0 || 
        job.eligibility?.departments?.some(deptId => deptId.toString() === student.department?.toString());

      if (isEligibleDept) {
        matchScore += 40;
        matchBreakdown.branch = 40;
      }

      // 2. CGPA Match (Weight: 20%)
      const minCGPA = job.eligibility?.minCGPA || 0;
      if (student.cgpa >= minCGPA) {
        matchScore += 20;
        matchBreakdown.cgpa = 20;
      } else if (student.cgpa && student.cgpa >= minCGPA - 0.5) {
        // Partial score for borderline CGPA
        matchScore += 10;
        matchBreakdown.cgpa = 10;
      }

      // 3. Skills Match (Weight: 40%)
      if (job.requiredSkills && job.requiredSkills.length > 0 && student.skills && student.skills.length > 0) {
        const studentSkillsLower = student.skills.map(s => s.toLowerCase());
        const matchedSkills = job.requiredSkills.filter(skill => 
          studentSkillsLower.includes(skill.toLowerCase())
        );
        const skillMatchPercent = matchedSkills.length / job.requiredSkills.length;
        const skillScore = Math.round(skillMatchPercent * 40);
        matchScore += skillScore;
        matchBreakdown.skills = skillScore;
      }

      // Recommend if match is 35% or above
      if (matchScore >= 35) {
        recommendedJobs.push({
          job,
          matchScore,
          matchBreakdown,
        });
      }
    }

    // Sort by compatibility descending
    recommendedJobs.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      count: recommendedJobs.length,
      recommendations: recommendedJobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
