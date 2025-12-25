import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import '../../assets/style/OTPmodal.css';

const API_URL = '/api';

function OTPmodal({ email, userId, onSuccess, onCancel }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('').slice(0, 6);
      setOtp(newOtp);
      setError('');
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit OTP code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/auth/verify-otp`, {
        email,
        otp: otpCode
      });

      if (response.data.success) {
        onSuccess(response.data.user, response.data.token);
      } else {
        setError('Failed to verify OTP');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Invalid OTP code');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/auth/resend-otp`, { email });

      if (response.data.success) {
        setError('');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Failed to resend OTP');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="otp-modal-overlay">
      <div className="otp-modal-container">
        <button className="otp-modal-close" onClick={onCancel}>
          <X size={24} />
        </button>

        <div className="otp-modal-content">
          <h2 className="otp-modal-title">Enter OTP Code</h2>
          <p className="otp-modal-subtitle">
            We've sent a 6-digit code to <strong>{email}</strong>
          </p>

          <div className="otp-input-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`otp-input ${error ? 'error' : ''}`}
              />
            ))}
          </div>

          {error && <div className="otp-error-message">{error}</div>}

          <button
            onClick={handleVerify}
            disabled={loading || otp.join('').length !== 6}
            className="otp-verify-button"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <div className="otp-resend-container">
            <p className="otp-resend-text">Didn't receive the code?</p>
            <button
              onClick={handleResend}
              disabled={resending}
              className="otp-resend-button"
            >
              {resending ? 'Sending...' : 'Resend OTP'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OTPmodal;

