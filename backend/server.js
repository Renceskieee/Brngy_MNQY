const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const { login, verifyOTP, resendOTP, requestPasswordReset, confirmPasswordReset } = require('./database/auth');
const createAccount = require('./database/users/createAccount');
const userSettings = require('./database/users/settings');
const personalisation = require('./database/users/personalisation');
const residents = require('./database/users/residents');
const history = require('./database/users/history');
const households = require('./database/users/households');
const incidents = require('./database/users/incidents');
const timeLog = require('./database/users/time_log');
const usersAccount = require('./database/users/usersAccount');
const services = require('./database/users/services');

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

app.get('/api/users', usersAccount.getAllUsers);
app.get('/api/users/:id', usersAccount.getUserById);
app.put('/api/users/:id', usersAccount.updateUser);
app.put('/api/users/:id/reset-password', usersAccount.resetPassword);
app.delete('/api/users/:id', userSettings.deleteUser);

app.get('/api/personalisation', personalisation.getPersonalisation);
app.put('/api/personalisation', personalisation.updatePersonalisation);
app.post('/api/personalisation/logo', personalisation.uploadLogo);
app.post('/api/personalisation/main-bg', personalisation.uploadMainBg);
app.get('/api/carousel', personalisation.getCarousel);
app.post('/api/carousel', personalisation.addCarouselImage);
app.put('/api/carousel/:id/position', personalisation.updateCarouselPosition);
app.delete('/api/carousel/:id', personalisation.deleteCarouselImage);

app.get('/api/residents', residents.getAllResidents);
app.get('/api/residents/count', residents.getResidentsCount);
app.get('/api/residents/:id', residents.getResidentById);
app.post('/api/residents', residents.createResident);
app.put('/api/residents/:id', residents.updateResident);
app.delete('/api/residents/:id', residents.deleteResident);

app.get('/api/history', history.getRecentHistory);

app.get('/api/households', households.getAllHouseholds);
app.get('/api/households/count', households.getHouseholdsCount);
app.get('/api/households/:id', households.getHouseholdById);
app.post('/api/households', households.createHousehold);
app.put('/api/households/:id', households.updateHousehold);
app.delete('/api/households/:id', households.deleteHousehold);

app.get('/api/incidents', incidents.getAllIncidents);
app.get('/api/incidents/count', incidents.getIncidentsCount);
app.get('/api/incidents/:id', incidents.getIncidentById);
app.post('/api/incidents', incidents.createIncident);
app.put('/api/incidents/:id', incidents.updateIncident);
app.delete('/api/incidents/:id', incidents.deleteIncident);

app.post('/api/users/:id/profile-picture', userSettings.uploadProfilePicture);
app.delete('/api/users/:id/profile-picture', userSettings.removeProfilePicture);
app.put('/api/users/:id/change-password', userSettings.changePassword);

app.get('/api/time-logs', timeLog.getTimeLogs);
app.get('/api/time-logs/:id', timeLog.getTimeLogById);
app.post('/api/time-logs', timeLog.createTimeLog);
app.put('/api/time-logs/:id', timeLog.updateTimeLog);

app.get('/api/services', services.getAllServices);
app.get('/api/services/count', services.getServicesCount);
app.get('/api/services/:id', services.getServiceById);
app.get('/api/services/:id/beneficiaries', services.getServiceBeneficiaries);
app.post('/api/services', services.createService);
app.put('/api/services/:id', services.updateService);
app.delete('/api/services/:id', services.deleteService);
app.post('/api/services/:id/beneficiaries', services.addBeneficiary);
app.delete('/api/services/:id/beneficiaries/:beneficiaryId', services.removeBeneficiary);

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
