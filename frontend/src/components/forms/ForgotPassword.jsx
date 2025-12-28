import { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import Messages from '../shared/Messages';
import '../../assets/style/ForgotPassword.css';

const API_URL = '/api';

function ForgotPassword({ onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState('');
  const [step, setStep] = useState('email');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setErrors('Email is required');
      return;
    }
    setLoading(true);
    setErrors('');
    try {
      const response = await axios.post(`${API_URL}/auth/request-password-reset`, { email });
      if (response.data.success) {
        setStep('otp');
        setMessage({ text: 'OTP sent to your email', type: 'success' });
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to send OTP';
      setErrors(msg);
      setMessage({ text: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otp.trim()) {
      setErrors('OTP is required');
      return;
    }
    setLoading(true);
    setErrors('');
    try {
      const response = await axios.post(`${API_URL}/auth/confirm-password-reset`, { email, otp });
      if (response.data.success) {
        const successText = 'Password reset to default. Please check your email.';
        setMessage({ text: successText, type: 'success' });
        onSuccess(successText);
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid OTP';
      setErrors(msg);
      setMessage({ text: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-overlay">
      <div className="forgot-modal">
        <div className="forgot-header">
          <h3 className="forgot-title">Reset Password</h3>
          <button className="forgot-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="forgot-body">
          {step === 'email' && (
            <>
              <label className="forgot-label" htmlFor="forgot-email">Registered Email</label>
              <input
                id="forgot-email"
                type="email"
                className={`forgot-input ${errors ? 'error' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
              />
              {errors && <p className="forgot-error">{errors}</p>}
              <button className="forgot-button" onClick={handleSendOtp} disabled={loading}>
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </>
          )}

          {step === 'otp' && (
            <>
              <label className="forgot-label" htmlFor="forgot-otp">Enter OTP</label>
              <input
                id="forgot-otp"
                type="text"
                className={`forgot-input ${errors ? 'error' : ''}`}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the OTP sent to your email"
              />
              {errors && <p className="forgot-error">{errors}</p>}
              <button className="forgot-button" onClick={handleVerify} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </>
          )}
        </div>

        {message.text && (
          <Messages
            message={message.text}
            type={message.type}
            onClose={() => setMessage({ text: '', type: '' })}
          />
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;





