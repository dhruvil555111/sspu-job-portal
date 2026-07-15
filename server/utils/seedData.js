import Department from '../models/Department.js';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

/**
 * Seeds initial departments into the database
 * Based on Shree Saurashtra Patel University's department structure
 */
const departmentSeeds = [
  { name: 'B.Sc IT', code: 'BSC_IT', icon: '🌐', description: 'Bachelor of Science in Information Technology' },
  { name: 'BCA', code: 'BCA', icon: '💻', description: 'Bachelor of Computer Applications' },
  { name: 'BBA', code: 'BBA', icon: '📈', description: 'Bachelor of Business Administration' },
  { name: 'MBA', code: 'MBA', icon: '💼', description: 'Master of Business Administration' },
  { name: 'BE Computer Engineering', code: 'BE_CE', icon: '⚙️', description: 'Bachelor of Engineering in Computer Engineering' },
  { name: 'BE Information Technology', code: 'BE_IT', icon: '🖥️', description: 'Bachelor of Engineering in Information Technology' },
  { name: 'MCA', code: 'MCA', icon: '🎓', description: 'Master of Computer Applications' }
];

export const seedDepartments = async () => {
  try {
    // 1. Seed Departments
    const deptCount = await Department.countDocuments();
    let departments = [];
    if (deptCount === 0) {
      departments = await Department.insertMany(departmentSeeds);
      console.log('✅ SSPU Departments seeded successfully');
    } else {
      departments = await Department.find();
    }

    // Map department codes to ObjectIds for demo users
    const getDeptId = (code) => {
      const dept = departments.find(d => d.code === code);
      return dept ? dept._id : null;
    };

    // 2. Seed Super Admin Demo User
    const adminEmail = 'admin@sspu.edu.in';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        name: 'SSPU Super Admin',
        email: adminEmail,
        password: 'admin123',
        role: 'superadmin',
        phone: '9998887771',
        isVerified: true,
        isApproved: true,
        department: getDeptId('MCA')
      });
      console.log('✅ Demo Super Admin seeded');
    }

    // 3. Seed TPO Demo User
    const tpoEmail = 'tpo@sspu.edu.in';
    const tpoExists = await User.findOne({ email: tpoEmail });
    if (!tpoExists) {
      await User.create({
        name: 'SSPU Placement Officer',
        email: tpoEmail,
        password: 'tpo123',
        role: 'tpo',
        phone: '9998887772',
        isVerified: true,
        isApproved: true,
        department: getDeptId('MCA')
      });
      console.log('✅ Demo TPO seeded');
    }

    // 4. Seed Student Demo User
    const studentEmail = 'student@sspu.edu.in';
    const studentExists = await User.findOne({ email: studentEmail });
    let studentUser = studentExists;
    if (!studentExists) {
      studentUser = await User.create({
        name: 'Rahul Patel',
        email: studentEmail,
        password: 'student123',
        role: 'student',
        phone: '9998887773',
        isVerified: true,
        isApproved: true,
        department: getDeptId('MCA')
      });
      console.log('✅ Demo Student user created');
    }

    const studentProfileExists = await Student.findOne({ user: studentUser._id });
    if (!studentProfileExists) {
      await Student.create({
        user: studentUser._id,
        enrollmentNo: 'SSPU2023CS045',
        department: getDeptId('MCA'),
        program: 'MCA',
        semester: 6,
        passingYear: 2026,
        cgpa: 8.7,
        tenthPercentage: 88,
        twelfthPercentage: 85,
        skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Python', 'SQL'],
        projects: [
          {
            title: 'Campus Placement Portal',
            description: 'Developed SSPU Career Connect portal, an online job application platform for students.',
            technologies: ['React', 'Tailwind', 'Express', 'MongoDB'],
            github: 'https://github.com/rahulpatel/placement-portal'
          }
        ],
        isProfileComplete: true,
        isApprovedByCoordinator: true
      });
      console.log('✅ Demo Student profile seeded');
    }

    // 5. Seed Recruiter Demo User
    const recruiterEmail = 'recruiter@company.com';
    const recruiterExists = await User.findOne({ email: recruiterEmail });
    if (!recruiterExists) {
      await User.create({
        name: 'Jane Recruiter',
        email: recruiterEmail,
        password: 'recruiter123',
        role: 'recruiter',
        phone: '9998887774',
        isVerified: true,
        isApproved: true
      });
      console.log('✅ Demo Recruiter Jane seeded');
    }

    // Ensure student profiles exist for student and student2
    const student2Email = 'student2@sspu.edu.in';
    const student2Exists = await User.findOne({ email: student2Email });
    let student2User = student2Exists;
    if (!student2Exists) {
      student2User = await User.create({
        name: 'Amit Patel',
        email: student2Email,
        password: 'student123',
        role: 'student',
        phone: '9998887779',
        isVerified: true,
        isApproved: true,
        department: getDeptId('MCA')
      });
    }

    let student2Profile = await Student.findOne({ user: student2User._id });
    if (!student2Profile) {
      student2Profile = await Student.create({
        user: student2User._id,
        enrollmentNo: 'SSPU2023CS099',
        department: getDeptId('MCA'),
        program: 'MCA',
        semester: 6,
        passingYear: 2026,
        cgpa: 9.1,
        tenthPercentage: 90,
        twelfthPercentage: 92,
        skills: ['React', 'Node.js', 'Java'],
        isProfileComplete: true,
        isApprovedByCoordinator: true
      });
      console.log('✅ Demo Student 2 profile seeded');
    }

    const recruiters = await User.find({ role: 'recruiter' });
    for (const rec of recruiters) {
      // Find or create company for this recruiter
      let recCompany = await Company.findOne({ recruiters: rec._id });
      if (!recCompany) {
        recCompany = await Company.create({
          name: `${rec.name.split(' ')[0]}'s Tech Solutions`,
          email: `hiring@${rec.email.split('@')[1]}`,
          website: `https://${rec.email.split('@')[1]}`,
          description: 'A leading technology services company based in Saurashtra, Gujarat.',
          industry: 'Information Technology',
          companySize: '51-200',
          location: { city: 'Rajkot', state: 'Gujarat', country: 'India' },
          contactPerson: { name: rec.name, email: rec.email, phone: rec.phone || '9998887774', designation: 'Hiring Manager' },
          isVerified: true,
          isActive: true,
          recruiters: [rec._id]
        });
        console.log(`✅ Company profile seeded for ${rec.email}`);
      }

      // Check if this recruiter has posted jobs
      const recJobsCount = await Job.countDocuments({ postedBy: rec._id });
      if (recJobsCount === 0) {
        const job1 = await Job.create({
          title: 'Full Stack Web Developer',
          company: recCompany._id,
          postedBy: rec._id,
          description: 'We are looking for a full stack web developer proficient in MERN stack.',
          requirements: 'Knowledge of React, Node, Express, MongoDB.',
          responsibilities: 'Build scalable APIs and frontends.',
          jobType: 'full-time',
          workMode: 'remote',
          location: 'Rajkot',
          package: { min: 8, max: 12, currency: 'INR', period: 'yearly' },
          experience: { min: 0, max: 2 },
          eligibility: {
            departments: [getDeptId('MCA')],
            minCGPA: 7.5,
            passingYears: [2026],
            skills: ['React', 'Node.js'],
          },
          requiredSkills: ['React', 'Node.js', 'MongoDB'],
          vacancies: 3,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: 'active',
          isApprovedByTPO: true
        });

        const job2 = await Job.create({
          title: 'Product Management Intern',
          company: recCompany._id,
          postedBy: rec._id,
          description: 'Internship role in product management and growth analysis.',
          requirements: 'Strong analytical skills and MBA/BBA background.',
          jobType: 'internship',
          workMode: 'hybrid',
          location: 'Ahmedabad',
          package: { min: 15, max: 25, currency: 'INR', period: 'monthly' },
          eligibility: {
            departments: [getDeptId('MBA'), getDeptId('BBA')],
            minCGPA: 6.5,
            passingYears: [2026],
          },
          deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          status: 'active',
          isApprovedByTPO: true
        });

        const job3 = await Job.create({
          title: 'Data Analyst',
          company: recCompany._id,
          postedBy: rec._id,
          description: 'Analyze complex datasets and draft business intelligence templates.',
          requirements: 'SQL, Python, Excel, PowerBI.',
          jobType: 'full-time',
          workMode: 'onsite',
          location: 'Rajkot',
          package: { min: 6, max: 8, currency: 'INR', period: 'yearly' },
          eligibility: {
            departments: [getDeptId('BSC_IT'), getDeptId('BCA')],
            minCGPA: 7.0,
          },
          deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Expired/closed
          status: 'closed',
          isApprovedByTPO: true
        });

        // Seed applications for this recruiter's jobs
        // 1st student application
        const studentProfile = await Student.findOne({ user: studentUser._id });
        if (studentProfile) {
          const app1 = await Application.create({
            job: job1._id,
            student: studentProfile._id,
            user: studentUser._id,
            status: 'applied',
            coverLetter: 'I am highly interested in the Full Stack Developer position.',
            statusHistory: [{ status: 'applied', remarks: 'Applied via portal' }]
          });
          await Job.findByIdAndUpdate(job1._id, { $push: { applications: app1._id }, $inc: { totalApplications: 1 } });

          const app2 = await Application.create({
            job: job2._id,
            student: studentProfile._id,
            user: studentUser._id,
            status: 'shortlisted',
            coverLetter: 'Applying for product management intern.',
            statusHistory: [
              { status: 'applied', remarks: 'Applied via portal' },
              { status: 'shortlisted', remarks: 'Good profile' }
            ]
          });
          await Job.findByIdAndUpdate(job2._id, { $push: { applications: app2._id }, $inc: { totalApplications: 1 } });
        }

        // 2nd student application
        if (student2Profile) {
          const app3 = await Application.create({
            job: job1._id,
            student: student2Profile._id,
            user: student2User._id,
            status: 'selected',
            coverLetter: 'Passionate about building scalable backend services.',
            statusHistory: [
              { status: 'applied', remarks: 'Applied' },
              { status: 'shortlisted', remarks: 'Good test scores' },
              { status: 'selected', remarks: 'Selected after final round' }
            ]
          });
          await Job.findByIdAndUpdate(job1._id, { $push: { applications: app3._id }, $inc: { totalApplications: 1 } });
        }

        console.log(`✅ Demo Jobs and Applications seeded successfully for ${rec.email}`);
      }
    }
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
  }
};

export default departmentSeeds;
