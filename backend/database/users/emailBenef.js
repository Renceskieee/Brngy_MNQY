const pool = require('../config');
const nodemailer = require('nodemailer');
const history = require('./history');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const formatDateOnly = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const options = { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
};

const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

const sendEmailToBeneficiaries = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, message } = req.body;

    if (!subject || !subject.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email subject is required'
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email message is required'
      });
    }

    const [services] = await pool.execute(
      'SELECT id, service_name, location, date, time, status, description FROM services WHERE id = ?',
      [id]
    );

    if (services.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const service = services[0];

    const [beneficiaries] = await pool.execute(
      `SELECT r.id, r.f_name, r.m_name, r.l_name, r.suffix, r.email
       FROM service_beneficiaries sb
       JOIN residents r ON sb.resident_id = r.id
       WHERE sb.service_id = ? AND r.email IS NOT NULL AND r.email != ''`,
      [id]
    );

    if (beneficiaries.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No beneficiaries with valid email addresses found for this service'
      });
    }

    const serviceDate = formatDateOnly(service.date);
    const serviceTime = formatTime(service.time);

    const emailResults = [];
    let successCount = 0;
    let failCount = 0;

    for (const beneficiary of beneficiaries) {
      const suffix = beneficiary.suffix && beneficiary.suffix !== 'NA' ? ` ${beneficiary.suffix}` : '';
      const mName = beneficiary.m_name ? ` ${beneficiary.m_name}` : '';
      const fullName = `${beneficiary.f_name}${mName} ${beneficiary.l_name}${suffix}`;

      const emailHtml = `
        <div style="font-family: 'Poppins', Arial, sans-serif; padding: 20px; background-color: #f3f4f6;">
          <div style="max-width: 680px; margin: 0 auto; background:#ffffff; padding:22px; border-radius:8px; border:1px solid #e6e7eb;">
            <h2 style="color:#111827; font-size:18px; margin:0 0 10px;">${subject}</h2>
            <p style="color:#374151; font-size:14px; margin:0 0 12px;">Hello ${fullName},</p>
            <div style="background:#f9fafb; border:1px solid #e5e7eb; padding:16px; border-radius:6px; margin-bottom:16px;">
              <p style="margin:0 0 8px; font-size:14px; color:#374151;"><strong>Service:</strong> <span style="color:#111827;">${service.service_name}</span></p>
              <p style="margin:0 0 8px; font-size:14px; color:#374151;"><strong>Location:</strong> <span style="color:#111827;">${service.location}</span></p>
              <p style="margin:0 0 8px; font-size:14px; color:#374151;"><strong>Date:</strong> <span style="color:#111827;">${serviceDate}</span></p>
              <p style="margin:0; font-size:14px; color:#374151;"><strong>Time:</strong> <span style="color:#111827;">${serviceTime}</span></p>
            </div>
            <div style="color:#374151; font-size:14px; margin:0 0 16px; line-height:1.6;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <hr style="border:none; border-top:1px solid #eef2f7; margin:16px 0;" />
            <p style="font-size:12px; color:#9ca3af; margin:0;">SK Barangay Information System</p>
          </div>
        </div>
      `;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: beneficiary.email,
        subject: subject,
        html: emailHtml
      };

      try {
        await transporter.sendMail(mailOptions);
        successCount++;
        emailResults.push({
          beneficiaryId: beneficiary.id,
          email: beneficiary.email,
          success: true
        });
      } catch (error) {
        failCount++;
        emailResults.push({
          beneficiaryId: beneficiary.id,
          email: beneficiary.email,
          success: false,
          error: error.message
        });
      }
    }

    const userId = req.body.userId || req.user?.userId || null;
    if (userId && service) {
      const description = `Sent emails to beneficiaries of service: ${service.service_name}`;
      await history.createHistory(userId, null, null, description, null, service.id);
    }

    res.json({
      success: true,
      message: `Emails sent: ${successCount} successful, ${failCount} failed`,
      total: beneficiaries.length,
      successful: successCount,
      failed: failCount,
      results: emailResults
    });
  } catch (error) {
    console.error('Send email to beneficiaries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error sending emails to beneficiaries'
    });
  }
};

module.exports = {
  sendEmailToBeneficiaries
};

