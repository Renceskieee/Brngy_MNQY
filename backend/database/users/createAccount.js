const pool = require('../config');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
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

const createAccount = async (req, res) => {
  try {
    const { employee_id, first_name, last_name, email, contact_number, phone_number, position } = req.body;
    const contactNumber = contact_number || phone_number || null;

    if (!employee_id || !first_name || !last_name || !email || !position) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    if (position !== 'admin' && position !== 'staff') {
      return res.status(400).json({
        success: false,
        message: 'Invalid position. Must be admin or staff'
      });
    }

    const [existingUsers] = await pool.execute(
      `SELECT id FROM users WHERE employee_id = ? OR email = ?`,
      [employee_id, email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Employee ID or Email already exists'
      });
    }

    const defaultPassword = last_name;
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const [result] = await pool.execute(
      `INSERT INTO users (employee_id, password, first_name, last_name, email, contact_number, position, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`,
      [employee_id, hashedPassword, first_name, last_name, email, contactNumber, position]
    );

    const username = employee_id;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Account Created — SK Barangay Information System',
      html: `
        <div style="font-family: 'Poppins', Arial, sans-serif; padding: 24px; background-color: #f3f4f6;">
          <div style="max-width: 680px; margin: 0 auto; background-color: #ffffff; padding: 28px; border-radius: 8px; border: 1px solid #e5e7eb;">
            <h2 style="color: #111827; font-size:20px; margin:0 0 12px; text-align:left;">Account Created</h2>
            <p style="color:#374151; font-size:14px; margin:0 0 12px;">Hello ${first_name} ${last_name},</p>
            <p style="color:#374151; font-size:14px; margin:0 0 16px;">An account has been created for you in the SK Barangay Information System. Please find your account credentials below. For security, change your password after your first login.</p>

            <div style="background:#f9fafb; border:1px solid #e5e7eb; padding:14px; border-radius:6px; margin-bottom:16px;">
              <p style="margin:0; font-size:13px; color:#374151;"><strong>Username:</strong> <span style="color:#111827;">${username}</span></p>
              <p style="margin:8px 0 0; font-size:13px; color:#374151;"><strong>Default password:</strong> <span style="color:#111827;">${defaultPassword}</span></p>
              <p style="margin:8px 0 0; font-size:12px; color:#6b7280;">You will be prompted to update your password after logging in.</p>
            </div>

            <p style="font-size:13px; color:#374151; margin:0 0 18px;">If you did not expect this account, please contact your administrator immediately.</p>

            <div style="text-align:left; margin-top:8px;">
              <a href="" style="display:inline-block; background:#dc2626; color:#ffffff; padding:10px 14px; border-radius:6px; text-decoration:none; font-weight:600;">Access the system</a>
            </div>

            <hr style="border:none; border-top:1px solid #eef2f7; margin:20px 0 8px;" />
            <p style="font-size:12px; color:#9ca3af; margin:0;">SK Barangay Information System</p>
          </div>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Account creation email error:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during account creation'
    });
  }
};

module.exports = createAccount;

