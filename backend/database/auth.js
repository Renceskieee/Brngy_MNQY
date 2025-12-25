const pool = require('./config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

const otpStore = new Map();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOTPEmail = async (email, otp, subject, purposeText) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
          <h2 style="color: #dc2626; text-align: center;">${subject}</h2>
          <p style="color: #333; font-size: 16px;">${purposeText}</p>
          <div style="text-align: center; margin: 30px 0;">
            <h1 style="color: #dc2626; font-size: 36px; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you did not request this code, please ignore this email.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

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

const login = async (req, res) => {
  try {
    const { position, username, password } = req.body;

    if (!position || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Position, username, and password are required'
      });
    }

    if (position !== 'admin' && position !== 'staff') {
      return res.status(400).json({
        success: false,
        message: 'Invalid position selected'
      });
    }

    const [users] = await pool.execute(
      `SELECT id, employee_id, password, first_name, last_name, email, position, status 
       FROM users 
       WHERE (employee_id = ? OR email = ?) AND position = ?`,
      [username, username, position]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = users[0];

    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive. Please contact administrator.'
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    otpStore.set(user.email, {
      otp,
      expiry: otpExpiry,
      userId: user.id,
      position: user.position,
      action: 'login'
    });

    const emailSent = await sendOTPEmail(
      user.email,
      otp,
      'Login OTP Verification',
      'Your OTP code for login is:'
    );
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.json({
      success: true,
      message: 'OTP sent to your email',
      email: user.email,
      userId: user.id
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    const storedOTP = otpStore.get(email);

    if (!storedOTP || storedOTP.action !== 'login') {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired'
      });
    }

    if (Date.now() > storedOTP.expiry) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    if (storedOTP.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP code'
      });
    }

    const [users] = await pool.execute(
      `SELECT id, employee_id, first_name, last_name, email, position, profile_picture 
       FROM users 
       WHERE id = ?`,
      [storedOTP.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];

    const token = jwt.sign(
      {
        userId: user.id,
        position: user.position,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    otpStore.delete(email);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        employee_id: user.employee_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        position: user.position,
        profile_picture: user.profile_picture
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during OTP verification'
    });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const storedOTP = otpStore.get(email);

    if (!storedOTP || storedOTP.action !== 'login') {
      return res.status(400).json({
        success: false,
        message: 'No pending OTP found for this email'
      });
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    otpStore.set(email, {
      ...storedOTP,
      otp,
      expiry: otpExpiry
    });

    const emailSent = await sendOTPEmail(
      email,
      otp,
      'Login OTP Verification',
      'Your OTP code for login is:'
    );
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.json({
      success: true,
      message: 'OTP resent to your email'
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during OTP resend'
    });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const [users] = await pool.execute(
      `SELECT id, first_name, last_name, email FROM users WHERE email = ?`,
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Email not found'
      });
    }

    const user = users[0];
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    otpStore.set(email, {
      otp,
      expiry: otpExpiry,
      userId: user.id,
      action: 'password-reset'
    });

    const emailSent = await sendOTPEmail(
      email,
      otp,
      'Password Reset OTP',
      'Use this code to reset your password:'
    );
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.json({
      success: true,
      message: 'OTP sent to your email for password reset'
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset request'
    });
  }
};

const confirmPasswordReset = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    const storedOTP = otpStore.get(email);

    if (!storedOTP || storedOTP.action !== 'password-reset') {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired'
      });
    }

    if (Date.now() > storedOTP.expiry) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    if (storedOTP.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP code'
      });
    }

    const [users] = await pool.execute(
      `SELECT id, first_name, last_name, email FROM users WHERE id = ?`,
      [storedOTP.userId]
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
      [hashedPassword, user.id]
    );

    try {
      await sendPasswordResetEmail(user.email, user.first_name, user.last_name, defaultPassword);
    } catch (emailErr) {
      console.error('Failed to send password reset confirmation email:', emailErr);
    }

    otpStore.delete(email);

    res.json({
      success: true,
      message: 'Password has been reset to default'
    });
  } catch (error) {
    console.error('Password reset confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset confirmation'
    });
  }
};

module.exports = {
  login,
  verifyOTP,
  resendOTP,
  requestPasswordReset,
  confirmPasswordReset
};


