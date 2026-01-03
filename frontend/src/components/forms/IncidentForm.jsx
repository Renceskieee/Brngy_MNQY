import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Info } from 'lucide-react';
import Messages from '../shared/Messages';
import '../../assets/style/IncidentForm.css';

const API_URL = '/api';

function IncidentForm({ onClose, incident = null, onSuccess }) {
  const [formData, setFormData] = useState({
    reference_number: '',
    incident_type: '',
    location: '',
    date: '',
    time: '',
    complainant: '',
    respondent: '',
    description: '',
    status: 'pending'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (incident) {
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const formatTimeForInput = (timeString) => {
        if (!timeString) return '';
        return timeString.substring(0, 5);
      };

      setFormData({
        reference_number: incident.reference_number || '',
        incident_type: incident.incident_type || '',
        location: incident.location || '',
        date: formatDateForInput(incident.date),
        time: formatTimeForInput(incident.time),
        complainant: incident.complainant || '',
        respondent: incident.respondent || '',
        description: incident.description || '',
        status: incident.status || 'pending'
      });
    }
  }, [incident]);

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

    if (!formData.incident_type.trim()) {
      newErrors.incident_type = 'Incident type is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    if (!formData.complainant.trim()) {
      newErrors.complainant = 'Complainant is required';
    }

    if (!formData.respondent.trim()) {
      newErrors.respondent = 'Respondent is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
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
        incident_type: formData.incident_type,
        location: formData.location,
        date: formData.date,
        time: formData.time,
        complainant: formData.complainant,
        respondent: formData.respondent,
        description: formData.description,
        status: formData.status,
        userId: user.id
      };

      let response;
      if (incident) {
        response = await axios.put(`${API_URL}/incidents/${incident.id}`, requestData);
      } else {
        response = await axios.post(`${API_URL}/incidents`, requestData);
      }

      if (response.data.success) {
        setMessage({ 
          text: incident ? 'Incident updated successfully' : 'Incident created successfully', 
          type: 'success' 
        });
        
        setTimeout(() => {
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
      const errorMessage = error.response?.data?.message || 
        (incident ? 'Failed to update incident' : 'Failed to create incident');
      setErrors({ submit: errorMessage });
      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="incident-form-overlay">
      <div className="incident-form-modal">
        <div className="incident-form-header">
          <div className="incident-form-title-row">
            <h2 className="incident-form-title">{incident ? 'Update Incident' : 'Add New Incident'}</h2>
          </div>
          <button className="incident-form-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="incident-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reference_number" className="form-label">
                Reference Number
                {!incident && <span style={{ fontSize: '0.85em', color: '#6b7280', marginLeft: '4px' }}>
                  (Auto-generated)
                </span>}
              </label>
              <input
                type="text"
                id="reference_number"
                name="reference_number"
                value={formData.reference_number}
                onChange={handleChange}
                className={`form-input ${errors.reference_number ? 'error' : ''}`}
                placeholder={incident ? formData.reference_number : "Will be auto-generated"}
                disabled={true}
                style={{ backgroundColor: '#e5e7eb', cursor: 'not-allowed' }}
              />
              {errors.reference_number && <span className="error-message">{errors.reference_number}</span>}
              {!incident && (
                <span style={{ fontSize: '0.75em', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                  Reference number will be automatically generated as INC-YYYY-XXXXXX
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`form-select form-select-tight ${errors.status ? 'error' : ''}`}
              >
                <option value="pending">Pending</option>
                <option value="ongoing">Ongoing</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
              {errors.status && <span className="error-message">{errors.status}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="incident_type" className="form-label">Incident Type *</label>
            <input
              type="text"
              id="incident_type"
              name="incident_type"
              value={formData.incident_type}
              onChange={handleChange}
              className={`form-input ${errors.incident_type ? 'error' : ''}`}
              placeholder="Enter incident type"
            />
            {errors.incident_type && <span className="error-message">{errors.incident_type}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="location" className="form-label">Location *</label>
            <textarea
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`form-input ${errors.location ? 'error' : ''}`}
              placeholder="Enter location"
              rows="2"
            />
            {errors.location && <span className="error-message">{errors.location}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date" className="form-label">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`form-input ${errors.date ? 'error' : ''}`}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.date && <span className="error-message">{errors.date}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="time" className="form-label">Time *</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={`form-input ${errors.time ? 'error' : ''}`}
              />
              {errors.time && <span className="error-message">{errors.time}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="complainant" className="form-label">Complainant *</label>
              <input
                type="text"
                id="complainant"
                name="complainant"
                value={formData.complainant}
                onChange={handleChange}
                className={`form-input ${errors.complainant ? 'error' : ''}`}
                placeholder="Enter complainant name"
              />
              {errors.complainant && <span className="error-message">{errors.complainant}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="respondent" className="form-label">Respondent *</label>
              <input
                type="text"
                id="respondent"
                name="respondent"
                value={formData.respondent}
                onChange={handleChange}
                className={`form-input ${errors.respondent ? 'error' : ''}`}
                placeholder="Enter respondent name"
              />
              {errors.respondent && <span className="error-message">{errors.respondent}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`form-input ${errors.description ? 'error' : ''}`}
              placeholder="Enter incident description"
              rows="4"
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <p className="form-instruction">
            Please review all entered details before {incident ? 'updating' : 'creating'} the incident.
          </p>

          {errors.submit && (
            <div className="submit-error">
              <span>{errors.submit}</span>
              <Info size={18} />
            </div>
          )}

          <button
            type="submit"
            className="incident-form-button"
            disabled={loading}
          >
            {loading ? (incident ? 'Updating...' : 'Creating...') : (incident ? 'Update Incident' : 'Create Incident')}
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

export default IncidentForm;