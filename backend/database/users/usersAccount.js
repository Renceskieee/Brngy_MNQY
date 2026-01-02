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

const sendPasswordResetEmail = async (email, firstName, lastName, newPassword) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your password has been reset — SK Barangay Information System',
    html: `
      <div style="font-family: 'Poppins', Arial, sans-serif; padding: 20px; background-color: #f3f4f6;">
        <div style="max-width: 680px; margin: 0 auto; background:#ffffff; padding:22px; border-radius:8px; border:1px solid #e6e7eb;">
          <h2 style="color:#111827; font-size:18px; margin:0 0 10px;">Password Reset Successful</h2>
          <p style="color:#374151; font-size:14px; margin:0 0 12px;">Hello ${firstName} ${lastName},</p>
          <p style="color:#374151; font-size:14px; margin:0 0 14px;">Your account password has been reset by the system. Please find your temporary credentials below. For security, change your password after logging in.</p>

          <div style="background:#f9fafb; border:1px solid #e5e7eb; padding:12px; border-radius:6px; margin-bottom:14px;">
            <p style="margin:0; font-size:13px; color:#374151;"><strong>Temporary password:</strong> <span style="color:#111827;">${newPassword}</span></p>
          </div>

          <p style="font-size:13px; color:#6b7280; margin:0 0 8px;">If you did not request this change, please contact your administrator immediately.</p>
          <hr style="border:none; border-top:1px solid #eef2f7; margin:16px 0;" />
          <p style="font-size:12px; color:#9ca3af; margin:0;">SK Barangay Information System</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error('Password reset email error:', err);
    return false;
  }
};

const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.execute(
      `SELECT id, employee_id, first_name, last_name, email, contact_number, 
       profile_picture, position, status, created_at, updated_at 
       FROM users 
       ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users'
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await pool.execute(
      `SELECT id, employee_id, first_name, last_name, email, contact_number, 
       profile_picture, position, status, created_at, updated_at 
       FROM users 
       WHERE id = ?`,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: users[0]
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user'
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, contact_number, position, status } = req.body;

    const [users] = await pool.execute(`SELECT id FROM users WHERE id = ?`, [id]);
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const updates = [];
    const values = [];

    if (first_name) {
      updates.push('first_name = ?');
      values.push(first_name);
    }
    if (last_name) {
      updates.push('last_name = ?');
      values.push(last_name);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    if (contact_number !== undefined) {
      updates.push('contact_number = ?');
      values.push(contact_number);
    }
    if (position) {
      updates.push('position = ?');
      values.push(position);
    }
    if (status) {
      updates.push('status = ?');
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(id);
    await pool.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating user'
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await pool.execute(
      `SELECT id, first_name, last_name, email FROM users WHERE id = ?`,
      [id]
    );
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];
    const defaultPassword = user.last_name || 'password';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    await pool.execute(
      `UPDATE users SET password = ? WHERE id = ?`,
      [hashedPassword, id]
    );

    try {
      await sendPasswordResetEmail(user.email, user.first_name, user.last_name, defaultPassword);
    } catch (emailErr) {
      console.error('Failed to send password reset confirmation email:', emailErr);
    }

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error resetting password'
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  resetPassword
};

