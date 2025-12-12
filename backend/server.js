const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const { login, verifyOTP, resendOTP, requestPasswordReset, confirmPasswordReset } = require('./database/auth');
const createAccount = require('./database/users/createAccount');
const userSettings = require('./database/users/settings');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.post('/api/auth/login', login);
app.post('/api/auth/verify-otp', verifyOTP);
app.post('/api/auth/resend-otp', resendOTP);
app.post('/api/auth/request-password-reset', requestPasswordReset);
app.post('/api/auth/confirm-password-reset', confirmPasswordReset);

app.post('/api/users/create-account', createAccount);

app.get('/api/users', userSettings.getAllUsers);
app.get('/api/users/:id', userSettings.getUserById);
app.put('/api/users/:id', userSettings.updateUser);
app.put('/api/users/:id/reset-password', userSettings.resetPassword);
app.delete('/api/users/:id', userSettings.deleteUser);

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
