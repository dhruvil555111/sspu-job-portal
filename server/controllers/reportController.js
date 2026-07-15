import Student from '../models/Student.js';

// @desc    Generate CSV report of placed students
// @route   GET /api/reports/placements
// @access  Private (TPO, SuperAdmin)
export const getPlacementReport = async (req, res) => {
  try {
    // Find all placed students
    const students = await Student.find({ isPlaced: true })
      .populate('user', 'name email phone')
      .populate('department', 'name code');

    // CSV Headers
    let csvContent = 'Enrollment No,Student Name,Email,Phone,Department,Passing Year,CGPA,Company,Package (LPA),Placement Date\n';

    // Format rows
    students.forEach(student => {
      const enrollment = student.enrollmentNo || 'N/A';
      const name = student.user?.name || 'N/A';
      const email = student.user?.email || 'N/A';
      const phone = student.user?.phone || 'N/A';
      const deptName = student.department?.name || 'N/A';
      const passingYear = student.passingYear || 'N/A';
      const cgpa = student.cgpa || 'N/A';
      
      const company = student.placedAt?.company || 'N/A';
      const pkg = student.placedAt?.package || 'N/A';
      const date = student.placedAt?.date ? new Date(student.placedAt.date).toLocaleDateString() : 'N/A';

      // Escape quotes/commas in fields
      const row = [
        `"${enrollment}"`,
        `"${name.replace(/"/g, '""')}"`,
        `"${email}"`,
        `"${phone}"`,
        `"${deptName.replace(/"/g, '""')}"`,
        `"${passingYear}"`,
        `"${cgpa}"`,
        `"${company.replace(/"/g, '""')}"`,
        `"${pkg}"`,
        `"${date}"`
      ].join(',');

      csvContent += row + '\n';
    });

    // Set headers for download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=SSPU_Placement_Report.csv');
    
    return res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
