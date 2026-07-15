import Interview from '../models/Interview.js';
import Application from '../models/Application.js';
import Student from '../models/Student.js';
import Company from '../models/Company.js';
import Notification from '../models/Notification.js';
import { sendEmail, emailTemplates } from '../utils/email.js';

// @desc    Schedule interview
// @route   POST /api/interviews
// @access  Private (Recruiter)
export const scheduleInterview = async (req, res) => {
  try {
    const { applicationId, title, date, time, mode, link, venue, interviewer } = req.body;

    const application = await Application.findById(applicationId)
      .populate('student')
      .populate('user', 'name email')
      .populate({ path: 'job', populate: { path: 'company', select: 'name recruiters' } });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Verify company recruiter
    const company = application.job.company;
    if (!company.recruiters.includes(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Create interview
    const interview = await Interview.create({
      application: applicationId,
      student: application.student._id,
      job: application.job._id,
      company: company._id,
      title,
      date,
      time,
      mode,
      link,
      venue,
      interviewer,
    });

    // Update application
    application.status = 'interview';
    application.interviewSchedule = { date, time, venue, mode, link, instructions: `Interview with ${interviewer || 'recruitment team'}` };
    application.statusHistory.push({
      status: 'interview',
      changedBy: req.user.id,
      remarks: `Scheduled: ${title} on ${new Date(date).toLocaleDateString()} at ${time}`,
    });
    await application.save();

    // Create system notification
    await Notification.create({
      recipient: application.user._id,
      sender: req.user.id,
      type: 'interview-scheduled',
      title: 'Interview Scheduled',
      message: `Your interview for "${application.job.title}" has been scheduled: ${title} at ${time} on ${new Date(date).toLocaleDateString()}.`,
      link: '/student/dashboard',
    });

    // Send email notification
    await sendEmail({
      to: application.user.email,
      subject: `Interview Scheduled - ${application.job.title}`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">SSPU Career Connect</h1>
          </div>
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
            <h2 style="color: #1f2937;">Hello ${application.user.name}!</h2>
            <p style="color: #4b5563;">An interview has been scheduled for your application for <strong>${application.job.title}</strong> at <strong>${company.name}</strong>.</p>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Round:</strong> ${title}</p>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
              <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
              <p style="margin: 5px 0;"><strong>Mode:</strong> ${mode.toUpperCase()}</p>
              ${link ? `<p style="margin: 5px 0;"><strong>Link:</strong> <a href="${link}">${link}</a></p>` : ''}
              ${venue ? `<p style="margin: 5px 0;"><strong>Venue:</strong> ${venue}</p>` : ''}
            </div>
            <p style="color: #6b7280; font-size: 14px;">Please login to the portal for more instructions.</p>
          </div>
        </div>
      `,
    });

    res.status(201).json({ success: true, message: 'Interview scheduled successfully', interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student interviews
// @route   GET /api/interviews/student
// @access  Private (Student)
export const getStudentInterviews = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const interviews = await Interview.find({ student: student._id })
      .populate('job', 'title jobType')
      .populate('company', 'name logo location')
      .sort('date');

    res.status(200).json({ success: true, interviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recruiter interviews
// @route   GET /api/interviews/recruiter
// @access  Private (Recruiter)
export const getRecruiterInterviews = async (req, res) => {
  try {
    const company = await Company.findOne({ recruiters: req.user.id });
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company profile not found' });
    }

    const interviews = await Interview.find({ company: company._id })
      .populate({ path: 'student', populate: { path: 'user', select: 'name email phone avatar' } })
      .populate('job', 'title jobType')
      .sort('date');

    res.status(200).json({ success: true, interviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all interviews
// @route   GET /api/interviews
// @access  Private (TPO, Admin, Coordinator)
export const getAllInterviews = async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'coordinator') {
      // Limit to coordinator's department if necessary
      query.department = req.user.department;
    }

    const interviews = await Interview.find(query)
      .populate({ path: 'student', populate: [{ path: 'user', select: 'name email' }, { path: 'department', select: 'name code' }] })
      .populate('job', 'title')
      .populate('company', 'name')
      .sort('date');

    res.status(200).json({ success: true, interviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update interview status
// @route   PUT /api/interviews/:id
// @access  Private (Recruiter, TPO, Admin)
export const updateInterview = async (req, res) => {
  try {
    const { status, feedback } = req.body;
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    if (status) interview.status = status;
    if (feedback) interview.feedback = feedback;

    await interview.save();

    res.status(200).json({ success: true, message: 'Interview updated', interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
