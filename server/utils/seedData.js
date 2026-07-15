import Department from '../models/Department.js';

/**
 * Seeds initial departments into the database
 * Based on LJ University's actual department structure
 */
const departmentSeeds = [
  { name: 'Engineering (B.E./M.E.)', code: 'ENG', programs: ['B.E.', 'M.E.'], icon: '⚙️', description: 'School of Engineering offering undergraduate and postgraduate programs in various engineering disciplines.' },
  { name: 'Computer Applications (BCA, MCA, BSc-IT, MSc-IT)', code: 'CA', programs: ['BCA', 'MCA', 'BSc-IT', 'MSc-IT'], icon: '💻', description: 'Department of Computer Applications with comprehensive IT programs.' },
  { name: 'Business Management (MBA)', code: 'MBA', programs: ['MBA'], icon: '📊', description: 'School of Business Management offering MBA programs.' },
  { name: 'Business Management (BBA, iMBA)', code: 'BBA', programs: ['BBA', 'iMBA'], icon: '💼', description: 'Undergraduate business management programs.' },
  { name: 'Commerce (B.Com)', code: 'COM', programs: ['B.Com', 'M.Com'], icon: '📈', description: 'School of Commerce with focus on accounting and finance.' },
  { name: 'Applied Sciences (B.Sc./M.Sc.)', code: 'SCI', programs: ['B.Sc.', 'M.Sc.'], icon: '🔬', description: 'Department of Applied Sciences with various science programs.' },
  { name: 'Architecture (B.Arch)', code: 'ARCH', programs: ['B.Arch'], icon: '🏛️', description: 'School of Architecture and Planning.' },
  { name: 'Pharmacy (B.Pharm./M.Pharm.)', code: 'PHAR', programs: ['B.Pharm.', 'M.Pharm.'], icon: '💊', description: 'School of Pharmacy offering undergraduate and postgraduate programs.' },
  { name: 'Physiotherapy (BPT/MPT)', code: 'PHY', programs: ['BPT', 'MPT'], icon: '🏥', description: 'School of Physiotherapy with comprehensive healthcare programs.' },
  { name: 'Diploma Engineering (Polytechnic)', code: 'POLY', programs: ['Diploma'], icon: '🔧', description: 'LJ Polytechnic offering diploma engineering programs.' },
  { name: 'Event Management (BBA)', code: 'EVT', programs: ['BBA - Event Management'], icon: '🎪', description: 'Event Management specialization program.' },
  { name: 'Media & Communication (BA/MA)', code: 'MED', programs: ['BA', 'MA'], icon: '📺', description: 'School of Media and Communication.' },
  { name: 'Sports Management (BBA)', code: 'SPM', programs: ['BBA - Sports Management'], icon: '⚽', description: 'Sports Management specialization program.' },
  { name: 'Planning (M.Plan)', code: 'PLAN', programs: ['M.Plan'], icon: '🗺️', description: 'Master of Planning program.' },
  { name: 'Law', code: 'LAW', programs: ['B.A. LLB', 'LLB', 'LLM'], icon: '⚖️', description: 'School of Law with integrated and standalone programs.' },
  { name: 'Nursing', code: 'NUR', programs: ['B.Sc. Nursing', 'M.Sc. Nursing'], icon: '🩺', description: 'School of Nursing with healthcare programs.' },
  { name: 'Design', code: 'DES', programs: ['B.Des', 'M.Des'], icon: '🎨', description: 'School of Design with creative programs.' },
  { name: 'Doctoral Program (Ph.D.)', code: 'PHD', programs: ['Ph.D.'], icon: '🎓', description: 'Doctoral programs across various disciplines.' },
];

export const seedDepartments = async () => {
  try {
    const count = await Department.countDocuments();
    if (count === 0) {
      await Department.insertMany(departmentSeeds);
      console.log('✅ Departments seeded successfully');
    }
  } catch (error) {
    console.error('❌ Department seeding failed:', error.message);
  }
};

export default departmentSeeds;
