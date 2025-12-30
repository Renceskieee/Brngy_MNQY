import { useState } from 'react';
import axios from 'axios';
import { X, Info } from 'lucide-react';
import Messages from '../shared/Messages';
import '../../assets/style/CreateAccount.css';
import phFlag from '../../assets/logo/philippines.png';

const API_URL = '/api';

function CreateAccount({ onClose }) {
  const [formData, setFormData] = useState({
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    position: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

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

    if (!formData.employee_id.trim()) {
      newErrors.employee_id = 'Employee ID is required';
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    }

    if (!formData.position) {
      newErrors.position = 'Position is required';
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

    const formattedPhone = formData.phone_number.replace(/^0+/, '');

    try {
      const response = await axios.post(`${API_URL}/users/create-account`, {
        employee_id: formData.employee_id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        contact_number: formattedPhone,
        position: formData.position
      });

      if (response.data.success) {
        setMessage({ text: 'Account created successfully', type: 'success' });
        setTimeout(() => {
          setFormData({
            employee_id: '',
            first_name: '',
            last_name: '',
            email: '',
            phone_number: '',
            position: ''
          });
        }, 500);
        setTimeout(() => {
          setMessage({ text: '', type: '' });
          onClose();
        }, 3600);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create account';
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-account-overlay">
      <div className="create-account-modal">
        <div className="create-account-header">
          <div className="create-account-title-row">
            <h2 className="create-account-title">Create Account</h2>
          </div>
          <button className="create-account-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-account-form">
          <div className="form-group">
            <label htmlFor="employee_id" className="form-label">Employee ID</label>
            <input
              type="text"
              id="employee_id"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              className={`form-input ${errors.employee_id ? 'error' : ''}`}
              placeholder="Enter employee ID"
            />
            {errors.employee_id && <span className="error-message">{errors.employee_id}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name" className="form-label">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={`form-input ${errors.first_name ? 'error' : ''}`}
                placeholder="Enter first name"
              />
              {errors.first_name && <span className="error-message">{errors.first_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="last_name" className="form-label">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={`form-input ${errors.last_name ? 'error' : ''}`}
                placeholder="Enter last name"
              />
              {errors.last_name && <span className="error-message">{errors.last_name}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter email address"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone_number" className="form-label">Phone Number</label>
            <div className="phone-input-wrapper">
              <div className="phone-flag">
                <img src={phFlag} alt="PH" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className={`form-input phone-input ${errors.phone_number ? 'error' : ''}`}
                placeholder="Enter phone number"
              />
            </div>
            {errors.phone_number && <span className="error-message">{errors.phone_number}</span>}
          </div>

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

          <p className="form-instruction">
            Please review all entered details before creating the account.
          </p>

          {errors.submit && (
            <div className="submit-error">
              <span>{errors.submit}</span>
              <Info size={18} />
            </div>
          )}


          <button
            type="submit"
            className="create-account-button"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        {message.text && message.type === 'success' && (
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

export default CreateAccount;

