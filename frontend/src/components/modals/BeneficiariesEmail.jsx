import { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import Messages from '../shared/Messages';
import '../../assets/style/BeneficiariesEmail.css';

const API_URL = '/api';

function BeneficiariesEmail({ service, onClose, onSuccess }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailMessage, setEmailMessage] = useState({ text: '', type: '' });

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

  const validateForm = () => {
    const newErrors = {};
    if (!subject || !subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!message || !message.trim()) {
      newErrors.message = 'Message is required';
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
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await axios.post(
        `${API_URL}/services/${service.id}/send-email`,
        {
          subject: subject.trim(),
          message: message.trim(),
          userId: user.id
        }
      );

      if (response.data.success) {
        setEmailMessage({
          text: response.data.message,
          type: 'success'
        });
        setSubject('');
        setMessage('');
        if (onSuccess) {
          onSuccess();
        }
        setTimeout(() => {
          setEmailMessage({ text: '', type: '' });
          onClose();
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send emails';
      setEmailMessage({
        text: errorMessage,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!service) return null;

  return (
    <div className="beneficiaries-email-overlay">
      <div className="beneficiaries-email-modal">
        <div className="beneficiaries-email-header">
          <h3 className="beneficiaries-email-title">Send Email to Beneficiaries</h3>
          <button className="beneficiaries-email-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="beneficiaries-email-service-info">
          <p className="beneficiaries-email-service-label">Service:</p>
          <p className="beneficiaries-email-service-name">{service.service_name}</p>
          <div className="beneficiaries-email-service-details">
            <span>Location: {service.location}</span>
            <span>Date: {formatDateOnly(service.date)}</span>
            <span>Time: {formatTime(service.time)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="beneficiaries-email-form">
          <div className="beneficiaries-email-form-group">
            <label htmlFor="email-subject" className="beneficiaries-email-label">
              Subject
            </label>
            <input
              type="text"
              id="email-subject"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (errors.subject) {
                  setErrors(prev => ({ ...prev, subject: '' }));
                }
              }}
              className={`beneficiaries-email-input ${errors.subject ? 'error' : ''}`}
              placeholder="Enter email subject"
            />
            {errors.subject && (
              <span className="beneficiaries-email-error">{errors.subject}</span>
            )}
          </div>

          <div className="beneficiaries-email-form-group">
            <label htmlFor="email-message" className="beneficiaries-email-label">
              Message
            </label>
            <textarea
              id="email-message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message) {
                  setErrors(prev => ({ ...prev, message: '' }));
                }
              }}
              className={`beneficiaries-email-textarea ${errors.message ? 'error' : ''}`}
              placeholder="Enter your message here..."
              rows={6}
            />
            {errors.message && (
              <span className="beneficiaries-email-error">{errors.message}</span>
            )}
          </div>

          <div className="beneficiaries-email-actions">
            <button
              type="button"
              className="beneficiaries-email-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="beneficiaries-email-confirm"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </form>

        {emailMessage.text && (
          <Messages
            message={emailMessage.text}
            type={emailMessage.type}
            onClose={() => setEmailMessage({ text: '', type: '' })}
          />
        )}
      </div>
    </div>
  );
}

export default BeneficiariesEmail;

