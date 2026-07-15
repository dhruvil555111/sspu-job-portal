import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { studentAPI, adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { HiOutlineUser, HiOutlineAcademicCap, HiOutlineCode, HiOutlineFolder, HiOutlineBadgeCheck, HiOutlineUpload } from 'react-icons/hi';

const StudentProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [departments, setDepartments] = useState([]);
  
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    enrollmentNo: '',
    department: '',
    program: '',
    semester: 1,
    passingYear: new Date().getFullYear(),
    cgpa: 0,
    tenthPercentage: 0,
    twelfthPercentage: 0,
    diplomaPercentage: 0,
    skills: '',
    portfolio: '',
    github: '',
    linkedin: '',
    gender: 'male',
    address: { city: '', state: '', pincode: '' },
    projects: [],
    certificates: [],
  });

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const [profileRes, deptsRes] = await Promise.all([
          studentAPI.getProfile(),
          adminAPI.getDepartments()
        ]);
        if (profileRes.data.success) {
          const student = profileRes.data.student;
          setProfile({
            name: student.user?.name || '',
            phone: student.user?.phone || '',
            enrollmentNo: student.enrollmentNo || '',
            department: student.department?._id || '',
            program: student.program || '',
            semester: student.semester || 1,
            passingYear: student.passingYear || new Date().getFullYear(),
            cgpa: student.cgpa || 0,
            tenthPercentage: student.tenthPercentage || 0,
            twelfthPercentage: student.twelfthPercentage || 0,
            diplomaPercentage: student.diplomaPercentage || 0,
            skills: student.skills?.join(', ') || '',
            portfolio: student.portfolio || '',
            github: student.github || '',
            linkedin: student.linkedin || '',
            gender: student.gender || 'male',
            address: {
              city: student.address?.city || '',
              state: student.address?.state || '',
              pincode: student.address?.pincode || '',
            },
            projects: student.projects || [],
            certificates: student.certificates || [],
          });
        }
        if (deptsRes.data.success) {
          setDepartments(deptsRes.data.departments || []);
        }
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const skillsArray = profile.skills.split(',').map(s => s.trim()).filter(Boolean);
      const dataToSave = {
        ...profile,
        skills: skillsArray,
      };
      
      const { data } = await studentAPI.updateProfile(dataToSave);
      if (data.success) {
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to save profile details');
    } finally {
      setSaving(false);
    }
  };

  // Dynamic project helper
  const addProject = () => {
    setProfile(prev => ({
      ...prev,
      projects: [...prev.projects, { title: '', description: '', technologies: [], link: '', github: '' }]
    }));
  };

  const removeProject = (idx) => {
    setProfile(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== idx)
    }));
  };

  const updateProjectField = (idx, field, value) => {
    setProfile(prev => {
      const updated = [...prev.projects];
      if (field === 'technologies') {
        updated[idx][field] = value.split(',').map(t => t.trim());
      } else {
        updated[idx][field] = value;
      }
      return { ...prev, projects: updated };
    });
  };

  // Dynamic certificate helper
  const addCertificate = () => {
    setProfile(prev => ({
      ...prev,
      certificates: [...prev.certificates, { title: '', issuer: '', date: '', link: '' }]
    }));
  };

  const removeCertificate = (idx) => {
    setProfile(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== idx)
    }));
  };

  const updateCertificateField = (idx, field, value) => {
    setProfile(prev => {
      const updated = [...prev.certificates];
      updated[idx][field] = value;
      return { ...prev, certificates: updated };
    });
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <HiOutlineUser /> },
    { id: 'academics', label: 'Academics', icon: <HiOutlineAcademicCap /> },
    { id: 'skills', label: 'Skills & Links', icon: <HiOutlineCode /> },
    { id: 'projects', label: 'Projects', icon: <HiOutlineFolder /> },
    { id: 'certificates', label: 'Certificates', icon: <HiOutlineBadgeCheck /> },
  ];

  return (
    <div className="min-h-screen pt-24 bg-dark-50 dark:bg-dark-950 text-dark-900 dark:text-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-dark-900 dark:text-white">Edit Profile</h1>
          <p className="text-xs text-dark-500 mt-1">Keep your profile details up-to-date to improve job match accuracy.</p>
        </div>

        {loading ? (
          <div className="skeleton h-96 rounded-3xl" />
        ) : (
          <div className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl shadow-lg overflow-hidden">
            {/* Tabs navbar */}
            <div className="flex flex-wrap border-b border-dark-100 dark:border-dark-800 bg-dark-50/50 dark:bg-dark-950/20 px-4 pt-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-605'
                      : 'border-transparent text-dark-400 hover:text-dark-600'
                  }`}
                >
                  {tab.icon}{tab.label}
                </button>
              ))}
            </div>

            {/* Tab contents */}
            <form onSubmit={handleSave} className="p-8 space-y-6">
              
              {activeTab === 'personal' && (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-dark-500 block mb-1">Full Name</label>
                      <input type="text" name="name" required value={profile.name} onChange={handleChange} className="input-field py-2 text-xs" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-dark-500 block mb-1">Phone Number</label>
                      <input type="text" name="phone" required value={profile.phone} onChange={handleChange} className="input-field py-2 text-xs" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-dark-500 block mb-1">Gender</label>
                      <select name="gender" value={profile.gender} onChange={handleChange} className="input-field py-2 text-xs">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-dark-500 block mb-1">Enrollment Number</label>
                      <input type="text" name="enrollmentNo" required value={profile.enrollmentNo} onChange={handleChange} className="input-field py-2 text-xs" />
                    </div>
                  </div>

                  <div className="border-t border-dark-50 dark:border-dark-850 pt-4">
                    <h4 className="text-xs font-bold text-dark-700 dark:text-dark-300 uppercase mb-3">Address Details</h4>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-dark-400 block mb-1">City</label>
                        <input type="text" name="city" value={profile.address.city} onChange={handleAddressChange} className="input-field py-2 text-xs" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-dark-400 block mb-1">State</label>
                        <input type="text" name="state" value={profile.address.state} onChange={handleAddressChange} className="input-field py-2 text-xs" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-dark-400 block mb-1">Pincode</label>
                        <input type="text" name="pincode" value={profile.address.pincode} onChange={handleAddressChange} className="input-field py-2 text-xs" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'academics' && (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-dark-500 block mb-1">Department</label>
                      <select name="department" value={profile.department} onChange={handleChange} className="input-field py-2 text-xs">
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept._id} value={dept._id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-dark-500 block mb-1">Program / Degree</label>
                      <input type="text" name="program" placeholder="e.g. B.E. (CSE)" value={profile.program} onChange={handleChange} className="input-field py-2 text-xs" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-dark-500 block mb-1">Semester</label>
                      <input type="number" name="semester" min="1" max="10" value={profile.semester} onChange={handleChange} className="input-field py-2 text-xs" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-dark-500 block mb-1">CGPA</label>
                      <input type="number" name="cgpa" step="0.01" min="0" max="10" value={profile.cgpa} onChange={handleChange} className="input-field py-2 text-xs" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-dark-500 block mb-1">Passing Year</label>
                      <input type="number" name="passingYear" value={profile.passingYear} onChange={handleChange} className="input-field py-2 text-xs" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 border-t border-dark-50 dark:border-dark-850 pt-4">
                    <div>
                      <label className="text-xs font-semibold text-dark-400 block mb-1">10th Percentage (%)</label>
                      <input type="number" name="tenthPercentage" step="0.1" value={profile.tenthPercentage} onChange={handleChange} className="input-field py-2 text-xs" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-dark-400 block mb-1">12th Percentage (%)</label>
                      <input type="number" name="twelfthPercentage" step="0.1" value={profile.twelfthPercentage} onChange={handleChange} className="input-field py-2 text-xs" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-dark-400 block mb-1">Diploma Percentage (%)</label>
                      <input type="number" name="diplomaPercentage" step="0.1" value={profile.diplomaPercentage} onChange={handleChange} className="input-field py-2 text-xs" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-dark-500 block mb-1">Skills (comma-separated)</label>
                    <textarea name="skills" rows={2} placeholder="e.g. React.js, Node.js, Express.js, MongoDB, Java, Python" value={profile.skills} onChange={handleChange} className="input-field py-2 text-xs" />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-dark-400 block mb-1">Portfolio Website</label>
                      <input type="text" name="portfolio" placeholder="https://..." value={profile.portfolio} onChange={handleChange} className="input-field py-2 text-xs" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-dark-400 block mb-1">GitHub Profile</label>
                      <input type="text" name="github" placeholder="https://github.com/..." value={profile.github} onChange={handleChange} className="input-field py-2 text-xs" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-dark-400 block mb-1">LinkedIn Profile</label>
                      <input type="text" name="linkedin" placeholder="https://linkedin.com/in/..." value={profile.linkedin} onChange={handleChange} className="input-field py-2 text-xs" />
                    </div>
                  </div>

                  {/* PDF Resume upload simulated */}
                  <div className="border-t border-dark-50 dark:border-dark-850 pt-4">
                    <label className="text-xs font-semibold text-dark-500 block mb-2">Upload Resume (PDF format)</label>
                    <div className="border-2 border-dashed border-dark-200 dark:border-dark-800 rounded-2xl p-6 text-center hover:border-primary-500 transition-colors">
                      <HiOutlineUpload className="w-8 h-8 text-dark-450 mx-auto mb-2" />
                      <p className="text-[10px] text-dark-400">PDF files only. Max file size: 5MB.</p>
                      <input type="file" accept=".pdf" className="hidden" id="resume-file" />
                      <label htmlFor="resume-file" className="mt-3 inline-block px-4 py-1.5 bg-dark-50 dark:bg-dark-800 text-[10px] font-bold text-dark-700 dark:text-dark-200 rounded-lg cursor-pointer border border-dark-200 dark:border-dark-700">
                        Select Resume PDF
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-dark-700 dark:text-dark-300 uppercase">My Projects</h4>
                    <button type="button" onClick={addProject} className="px-3.5 py-1.5 bg-primary-600 text-white rounded-lg text-[10px] font-bold shadow-sm">
                      + Add Project
                    </button>
                  </div>

                  {profile.projects.length === 0 ? (
                    <p className="text-xs text-dark-405 italic">No projects listed. Add a project to improve your resume score.</p>
                  ) : (
                    <div className="space-y-4">
                      {profile.projects.map((proj, idx) => (
                        <div key={idx} className="bg-dark-50/50 dark:bg-dark-950/20 border border-dark-100 dark:border-dark-850 p-4 rounded-2xl relative space-y-3">
                          <button type="button" onClick={() => removeProject(idx)} className="absolute top-4 right-4 text-xs font-bold text-red-500 hover:underline">
                            Remove
                          </button>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-semibold text-dark-450 block mb-1">Project Title</label>
                              <input type="text" value={proj.title} onChange={(e) => updateProjectField(idx, 'title', e.target.value)} className="input-field py-1.5 text-xs bg-white dark:bg-dark-900" />
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-dark-450 block mb-1">Technologies (comma-separated)</label>
                              <input type="text" value={proj.technologies?.join(', ')} onChange={(e) => updateProjectField(idx, 'technologies', e.target.value)} className="input-field py-1.5 text-xs bg-white dark:bg-dark-900" />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-semibold text-dark-450 block mb-1">Project Description</label>
                            <textarea rows={2} value={proj.description} onChange={(e) => updateProjectField(idx, 'description', e.target.value)} className="input-field py-1.5 text-xs bg-white dark:bg-dark-900" />
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-semibold text-dark-450 block mb-1">Project Link (Demo)</label>
                              <input type="text" value={proj.link} onChange={(e) => updateProjectField(idx, 'link', e.target.value)} className="input-field py-1.5 text-xs bg-white dark:bg-dark-900" />
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-dark-450 block mb-1">GitHub Link</label>
                              <input type="text" value={proj.github} onChange={(e) => updateProjectField(idx, 'github', e.target.value)} className="input-field py-1.5 text-xs bg-white dark:bg-dark-900" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'certificates' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-dark-700 dark:text-dark-300 uppercase">My Certifications</h4>
                    <button type="button" onClick={addCertificate} className="px-3.5 py-1.5 bg-primary-600 text-white rounded-lg text-[10px] font-bold shadow-sm">
                      + Add Certificate
                    </button>
                  </div>

                  {profile.certificates.length === 0 ? (
                    <p className="text-xs text-dark-405 italic">No certificates listed. Validate your profile by adding certificates.</p>
                  ) : (
                    <div className="space-y-4">
                      {profile.certificates.map((cert, idx) => (
                        <div key={idx} className="bg-dark-50/50 dark:bg-dark-950/20 border border-dark-100 dark:border-dark-850 p-4 rounded-2xl relative space-y-3">
                          <button type="button" onClick={() => removeCertificate(idx)} className="absolute top-4 right-4 text-xs font-bold text-red-500 hover:underline">
                            Remove
                          </button>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-semibold text-dark-450 block mb-1">Certificate Title</label>
                              <input type="text" value={cert.title} onChange={(e) => updateCertificateField(idx, 'title', e.target.value)} className="input-field py-1.5 text-xs bg-white dark:bg-dark-900" />
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-dark-450 block mb-1">Issuing Organization</label>
                              <input type="text" value={cert.issuer} onChange={(e) => updateCertificateField(idx, 'issuer', e.target.value)} className="input-field py-1.5 text-xs bg-white dark:bg-dark-900" />
                            </div>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-semibold text-dark-450 block mb-1">Date Issued</label>
                              <input type="date" value={cert.date ? new Date(cert.date).toISOString().split('T')[0] : ''} onChange={(e) => updateCertificateField(idx, 'date', e.target.value)} className="input-field py-1.5 text-xs bg-white dark:bg-dark-900" />
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-dark-450 block mb-1">Certificate Verification URL</label>
                              <input type="text" value={cert.link} onChange={(e) => updateCertificateField(idx, 'link', e.target.value)} className="input-field py-1.5 text-xs bg-white dark:bg-dark-900" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Submit panel */}
              <div className="border-t border-dark-100 dark:border-dark-800 pt-6 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary text-xs py-2.5 px-8"
                >
                  {saving ? 'Saving changes...' : 'Save Profile Details'}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default StudentProfile;
