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

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your account has been created',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
            <h2 style="color: #dc2626; text-align: center;">Welcome, ${first_name} ${last_name}</h2>
            <p style="color: #333; font-size: 16px;">Your account has been created successfully.</p>
            <p style="color: #333; font-size: 16px;">Default password: <strong>${defaultPassword}</strong></p>
            <p style="color: #666; font-size: 14px;">Please log in and change your password as soon as possible.</p>
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

