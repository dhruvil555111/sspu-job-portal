import nodemailer from 'nodemailer';

/**
 * Email utility using Nodemailer
 * Supports HTML templates for various email types
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send email with HTML template
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"LJ Career Connect" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error.message);
    return false;
  }
};

/**
 * Email templates
 */
export const emailTemplates = {
  otp: (name, otp) => `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">LJ Career Connect</h1>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
        <h2 style="color: #1f2937;">Hello ${name}!</h2>
        <p style="color: #4b5563; line-height: 1.6;">Your verification OTP is:</p>
        <div style="text-align: center; margin: 25px 0;">
          <span style="background: #f3f4f6; padding: 15px 30px; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 8px; color: #667eea;">${otp}</span>
        </div>
        <p style="color: #6b7280; font-size: 14px;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
      </div>
    </div>
  `,

  applicationStatus: (name, jobTitle, company, status) => `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">LJ Career Connect</h1>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
        <h2 style="color: #1f2937;">Hello ${name}!</h2>
        <p style="color: #4b5563;">Your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> has been updated.</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="background: ${status === 'selected' ? '#10b981' : status === 'rejected' ? '#ef4444' : '#667eea'}; color: white; padding: 10px 24px; border-radius: 20px; font-weight: bold; text-transform: uppercase;">${status}</span>
        </div>
        <p style="color: #6b7280;">Login to your dashboard for more details.</p>
      </div>
    </div>
  `,

  welcome: (name, role) => `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">Welcome to LJ Career Connect!</h1>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
        <h2 style="color: #1f2937;">Hello ${name}! 🎉</h2>
        <p style="color: #4b5563; line-height: 1.6;">Your account has been created as <strong>${role}</strong>. Welcome to LJ University's Career Connect portal.</p>
        <p style="color: #4b5563;">Complete your profile to get started with placement opportunities!</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${process.env.CLIENT_URL}/login" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">Login Now</a>
        </div>
      </div>
    </div>
  `,
};
