import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Info } from 'lucide-react';
import Messages from '../shared/Messages';
import '../../assets/style/CreateAccount.css';
import phFlag from '../../assets/logo/philippines.png';

const API_URL = '/api';

function ResidentForm({ onClose, resident = null, onSuccess }) {
  const [formData, setFormData] = useState({
    f_name: '',
    m_name: '',
    l_name: '',
    suffix: 'NA',
    sex: '',
    birthdate: '',
    civil_status: '',
    contact_no: '',
    email: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (resident) {
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      setFormData({
        f_name: resident.f_name || '',
        m_name: resident.m_name || '',
        l_name: resident.l_name || '',
        suffix: resident.suffix || 'NA',
        sex: resident.sex || '',
        birthdate: formatDateForInput(resident.birthdate),
        civil_status: resident.civil_status || '',
        contact_no: resident.contact_no || '',
        email: resident.email || '',
        address: resident.address || ''
      });
    }
  }, [resident]);

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

    if (!formData.f_name.trim()) {
      newErrors.f_name = 'First name is required';
    }

    if (!formData.l_name.trim()) {
      newErrors.l_name = 'Last name is required';
    }

    if (!formData.sex) {
      newErrors.sex = 'Sex is required';
    }

    if (!formData.birthdate) {
      newErrors.birthdate = 'Birthdate is required';
    }

    if (!formData.civil_status) {
      newErrors.civil_status = 'Civil status is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
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
      const requestData = {
        ...formData,
        userId: user.id
      };

      let response;
      if (resident) {
        response = await axios.put(`${API_URL}/residents/${resident.id}`, requestData);
      } else {
        response = await axios.post(`${API_URL}/residents`, requestData);
      }

      if (response.data.success) {
        setMessage({ text: resident ? 'Resident updated successfully' : 'Resident created successfully', type: 'success' });
        setTimeout(() => {
          setFormData({
            f_name: '',
            m_name: '',
            l_name: '',
            suffix: 'NA',
            sex: '',
            birthdate: '',
            civil_status: '',
            contact_no: '',
            email: '',
            address: ''
          });
          if (onSuccess) {
            onSuccess();
          }
        }, 500);
        setTimeout(() => {
          setMessage({ text: '', type: '' });
          onClose();
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || (resident ? 'Failed to update resident' : 'Failed to create resident');
      setErrors({ submit: errorMessage });
      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-account-overlay">
      <div className="create-account-modal">
        <div className="create-account-header">
          <div className="create-account-title-row">
            <h2 className="create-account-title">{resident ? 'Update Resident' : 'Add New Resident'}</h2>
          </div>
          <button className="create-account-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-account-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="f_name" className="form-label">First Name *</label>
              <input
                type="text"
                id="f_name"
                name="f_name"
                value={formData.f_name}
                onChange={handleChange}
                className={`form-input ${errors.f_name ? 'error' : ''}`}
                placeholder="Enter first name"
              />
              {errors.f_name && <span className="error-message">{errors.f_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="m_name" className="form-label">Middle Name</label>
              <input
                type="text"
                id="m_name"
                name="m_name"
                value={formData.m_name}
                onChange={handleChange}
                className={`form-input ${errors.m_name ? 'error' : ''}`}
                placeholder="Enter middle name"
              />
              {errors.m_name && <span className="error-message">{errors.m_name}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="l_name" className="form-label">Last Name *</label>
              <input
                type="text"
                id="l_name"
                name="l_name"
                value={formData.l_name}
                onChange={handleChange}
                className={`form-input ${errors.l_name ? 'error' : ''}`}
                placeholder="Enter last name"
              />
              {errors.l_name && <span className="error-message">{errors.l_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="suffix" className="form-label">Suffix</label>
              <select
                id="suffix"
                name="suffix"
                value={formData.suffix}
                onChange={handleChange}
                className={`form-select form-select-tight ${errors.suffix ? 'error' : ''}`}
              >
                <option value="NA">None</option>
                <option value="Jr.">Jr.</option>
                <option value="Sr.">Sr.</option>
                <option value="II">II</option>
                <option value="III">III</option>
                <option value="IV">IV</option>
              </select>
              {errors.suffix && <span className="error-message">{errors.suffix}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sex" className="form-label">Sex *</label>
              <select
                id="sex"
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className={`form-select form-select-tight ${errors.sex ? 'error' : ''}`}
              >
                <option value="">Select sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.sex && <span className="error-message">{errors.sex}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="birthdate" className="form-label">Birthdate *</label>
              <input
                type="date"
                id="birthdate"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                className={`form-input ${errors.birthdate ? 'error' : ''}`}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.birthdate && <span className="error-message">{errors.birthdate}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="civil_status" className="form-label">Civil Status *</label>
            <select
              id="civil_status"
              name="civil_status"
              value={formData.civil_status}
              onChange={handleChange}
              className={`form-select form-select-tight ${errors.civil_status ? 'error' : ''}`}
            >
              <option value="">Select civil status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="widowed">Widowed</option>
              <option value="separated">Separated</option>
              <option value="divorced">Divorced</option>
            </select>
            {errors.civil_status && <span className="error-message">{errors.civil_status}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="contact_no" className="form-label">Contact Number</label>
            <div className="phone-input-wrapper">
              <div className="phone-flag">
                <img src={phFlag} alt="PH" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <input
                type="tel"
                id="contact_no"
                name="contact_no"
                value={formData.contact_no}
                onChange={handleChange}
                className={`form-input ${errors.contact_no ? 'error' : ''}`}
                placeholder="Enter contact number"
              />
            </div>
            {errors.contact_no && <span className="error-message">{errors.contact_no}</span>}
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
            <label htmlFor="address" className="form-label">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`form-input ${errors.address ? 'error' : ''}`}
              placeholder="Enter address"
              rows="3"
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          <p className="form-instruction">
            Please review all entered details before {resident ? 'updating' : 'creating'} the resident.
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
            {loading ? (resident ? 'Updating...' : 'Creating...') : (resident ? 'Update Resident' : 'Create Resident')}
          </button>
        </form>

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

export default ResidentForm;

