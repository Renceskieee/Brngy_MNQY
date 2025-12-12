import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import OTPmodal from './modals/OTPmodal';
import ForgotPassword from './forms/ForgotPassword';
import Messages from './shared/Messages';
import '../assets/style/Login.css';
import { Eye, EyeClosed } from 'lucide-react';

const API_URL = '/api';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    position: '',
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showOTP, setShowOTP] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginUserId, setLoginUserId] = useState(null);
  const [loginImages, setLoginImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    const fetchLoginImages = async () => {
      const defaultImage = '/uploads/personalisation/images/default.jpg';
      setLoginImages([defaultImage]);
      setCurrentImageIndex(0);
    };
    fetchLoginImages();
  }, []);

  useEffect(() => {
    if (loginImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % loginImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [loginImages.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.position) {
      newErrors.position = 'Please select a position';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData);

      if (response.data.success) {
        setLoginEmail(response.data.email);
        setLoginUserId(response.data.userId);
        setShowOTP(true);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setErrors({ submit: errorMessage });
      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSuccess = (userData, token) => {
    onLogin(userData, token);
    setMessage({ text: `Welcome, ${userData.first_name}`, type: 'success' });
    if (userData.position === 'admin') {
      navigate('/dashboard-admin');
    } else {
      navigate('/dashboard');
    }
  };

  const handleOTPCancel = () => {
    setShowOTP(false);
    setLoginEmail('');
    setLoginUserId(null);
  };

  return (
    <div className="login-page">
      <header className="app-header login-header">
        <div className="header-content">
          <img
            src="/uploads/logo/SK-NBBS_logo.png"
            alt="SK Logo"
            className="header-logo"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <h1 className="header-title">Sangguniang Kabataan – NBBS Dagat-Dagatan</h1>
        </div>
      </header>

      <div className="login-container">
        <div className="login-content">
          <div className="login-image-section">
            {loginImages.length > 0 && (
              <div className="image-carousel">
                <img
                  src={loginImages[currentImageIndex]}
                  alt="Login"
                  className="carousel-image"
                  onError={(e) => {
                    e.target.src = '/uploads/personalisation/images/default.jpg';
                  }}
                />
                {loginImages.length > 1 && (
                  <div className="carousel-indicators">
                    {loginImages.map((_, index) => (
                      <button
                        key={index}
                        className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="login-form-section">
            <div className="login-form-container">
              <h1 className="login-title">User Authentication</h1>

              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="position" className="form-label">Select position</label>
                  <select
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className={`form-select form-select-tight ${errors.position ? 'error' : ''}`}
                  >
                    <option value="">Select position</option>
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                  </select>
                  {errors.position && <span className="error-message">{errors.position}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`form-input ${errors.username ? 'error' : ''}`}
                    placeholder="Enter your username"
                  />
                  {errors.username && <span className="error-message">{errors.username}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`form-input ${errors.password ? 'error' : ''}`}
                      placeholder="Enter your password"
                    />

                    <span
                      className="password-toggle"
                      onClick={() => setShowPassword(prev => !prev)}
                    >
                      {showPassword ? <Eye /> : <EyeClosed />}
                    </span>
                  </div>

                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <div className="form-group forgot-row">
                  <button type="button" className="forgot-password-link" onClick={() => setShowForgot(true)}>
                    Forgot password?
                  </button>
                </div>

                {errors.submit && (
                  <div className="submit-error">
                    {errors.submit}
                  </div>
                )}

                <button
                  type="submit"
                  className="login-button"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <footer className="app-footer login-footer">
        <p>© SK Barangay Information System 2025</p>
      </footer>

      {showOTP && (
        <OTPmodal
          email={loginEmail}
          userId={loginUserId}
          onSuccess={handleOTPSuccess}
          onCancel={handleOTPCancel}
        />
      )}

      {showForgot && (
        <ForgotPassword
          onClose={() => setShowForgot(false)}
          onSuccess={(msg) => setMessage({ text: msg, type: 'success' })}
        />
      )}

      {message.text && (
        <Messages
          message={message.text}
          type={message.type}
          onClose={() => setMessage({ text: '', type: '' })}
        />
      )}
    </div>
  );
}

export default Login;

