import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Info, Plus, Trash2 } from 'lucide-react';
import Messages from '../shared/Messages';
import '../../assets/style/ServiceForm.css';

const API_URL = '/api';

function ServiceForm({ onClose, service = null, serviceId = null, mode = 'service', onSuccess }) {
  const [formData, setFormData] = useState({
    service_name: '',
    location: '',
    date: '',
    time: '',
    status: 'scheduled',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [availableResidents, setAvailableResidents] = useState([]);
  const [selectedResident, setSelectedResident] = useState('');
  const [loadingResidents, setLoadingResidents] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loadingBeneficiaries, setLoadingBeneficiaries] = useState(false);

  const isAddBeneficiariesMode = mode === 'add-beneficiaries' && (serviceId || service?.id);

  useEffect(() => {
    if (service && !isAddBeneficiariesMode) {
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
        service_name: service.service_name || '',
        location: service.location || '',
        date: formatDateForInput(service.date),
        time: formatTimeForInput(service.time),
        status: service.status || 'scheduled',
        description: service.description || ''
      });
    }
  }, [service, isAddBeneficiariesMode]);

  useEffect(() => {
    if (isAddBeneficiariesMode) {
      fetchAvailableResidents();
      fetchBeneficiaries();
    }
  }, [isAddBeneficiariesMode, serviceId, service]);

  const fetchAvailableResidents = async () => {
    setLoadingResidents(true);
    try {
      const response = await axios.get(`${API_URL}/residents`);
      if (response.data.success) {
        setAvailableResidents(response.data.residents);
      }
    } catch (error) {
      console.error('Error fetching residents:', error);
    } finally {
      setLoadingResidents(false);
    }
  };

  const fetchBeneficiaries = async () => {
    setLoadingBeneficiaries(true);
    try {
      const id = serviceId || service?.id;
      const response = await axios.get(`${API_URL}/services/${id}/beneficiaries`);
      if (response.data.success) {
        setBeneficiaries(response.data.beneficiaries);
      }
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
    } finally {
      setLoadingBeneficiaries(false);
    }
  };

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

    if (!isAddBeneficiariesMode) {
      if (!formData.service_name.trim()) {
        newErrors.service_name = 'Service name is required';
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

      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      }
    } else {
      if (!selectedResident) {
        newErrors.selectedResident = 'Please select a resident';
      }
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

      if (isAddBeneficiariesMode) {
        const id = serviceId || service?.id;
        const response = await axios.post(`${API_URL}/services/${id}/beneficiaries`, {
          resident_id: selectedResident
        });

        if (response.data.success) {
          setMessage({ text: 'Beneficiary added successfully', type: 'success' });
          setSelectedResident('');
          fetchBeneficiaries();
          fetchAvailableResidents();
          setTimeout(() => {
            setMessage({ text: '', type: '' });
          }, 2000);
        }
      } else {
        const requestData = {
          service_name: formData.service_name,
          location: formData.location,
          date: formData.date,
          time: formData.time,
          status: formData.status,
          description: formData.description,
          userId: user.id
        };

        let response;
        if (service) {
          response = await axios.put(`${API_URL}/services/${service.id}`, requestData);
        } else {
          response = await axios.post(`${API_URL}/services`, requestData);
        }

        if (response.data.success) {
          setMessage({ 
            text: service ? 'Service updated successfully' : 'Service created successfully', 
            type: 'success' 
          });
          
          setTimeout(() => {
            if (onSuccess) {
              onSuccess(response.data.service || response.data.serviceId);
            }
          }, 500);
          
          setTimeout(() => {
            setMessage({ text: '', type: '' });
            if (!service) {
              onClose();
            }
          }, 2000);
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
        (isAddBeneficiariesMode ? 'Failed to add beneficiary' : 
         (service ? 'Failed to update service' : 'Failed to create service'));
      setErrors({ submit: errorMessage });
      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBeneficiary = async (beneficiaryId) => {
    try {
      const id = serviceId || service?.id;
      const response = await axios.delete(`${API_URL}/services/${id}/beneficiaries/${beneficiaryId}`);
      if (response.data.success) {
        setMessage({ text: 'Beneficiary removed successfully', type: 'success' });
        fetchBeneficiaries();
        fetchAvailableResidents();
        setTimeout(() => {
          setMessage({ text: '', type: '' });
        }, 2000);
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Failed to remove beneficiary', type: 'error' });
    }
  };

  const getFullName = (resident) => {
    const suffix = resident.suffix && resident.suffix !== 'NA' ? ` ${resident.suffix}` : '';
    const mName = resident.m_name ? ` ${resident.m_name}` : '';
    return `${resident.l_name}, ${resident.f_name}${mName}${suffix}`;
  };

  const getAvailableResidentsForSelect = () => {
    const usedResidentIds = beneficiaries.map(b => b.resident_id);
    return availableResidents.filter(r => !usedResidentIds.includes(r.id));
  };

  if (isAddBeneficiariesMode) {
    return (
      <div className="service-form-overlay">
        <div className="service-form-modal">
          <div className="service-form-header">
            <div className="service-form-title-row">
              <h2 className="service-form-title">Add Beneficiaries</h2>
            </div>
            <button className="service-form-close" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="service-form">
            <div className="form-group">
              <label htmlFor="selectedResident" className="form-label">Select Resident *</label>
              <select
                id="selectedResident"
                value={selectedResident}
                onChange={(e) => {
                  setSelectedResident(e.target.value);
                  if (errors.selectedResident) {
                    setErrors(prev => ({ ...prev, selectedResident: '' }));
                  }
                }}
                className={`form-select form-select-tight ${errors.selectedResident ? 'error' : ''}`}
                disabled={loadingResidents}
              >
                <option value="">Select resident</option>
                {getAvailableResidentsForSelect().map(resident => (
                  <option key={resident.id} value={resident.id}>
                    {getFullName(resident)}
                  </option>
                ))}
              </select>
              {errors.selectedResident && <span className="error-message">{errors.selectedResident}</span>}
            </div>

            {loadingBeneficiaries ? (
              <div className="loading-state">Loading beneficiaries...</div>
            ) : beneficiaries.length > 0 ? (
              <div className="beneficiaries-list">
                <h3 className="beneficiaries-title">Current Beneficiaries</h3>
                {beneficiaries.map((beneficiary) => (
                  <div key={beneficiary.id} className="beneficiary-item">
                    <span>{getFullName(beneficiary)}</span>
                    <button
                      type="button"
                      className="remove-beneficiary-btn"
                      onClick={() => handleRemoveBeneficiary(beneficiary.id)}
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-beneficiaries">No beneficiaries added yet.</div>
            )}

            {errors.submit && (
              <div className="submit-error">
                <span>{errors.submit}</span>
                <Info size={18} />
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={onClose}
              >
                Close
              </button>
              <button
                type="submit"
                className="service-form-button"
                disabled={loading || loadingResidents}
              >
                {loading ? 'Adding...' : 'Add Beneficiary'}
              </button>
            </div>
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

  return (
    <div className="service-form-overlay">
      <div className="service-form-modal">
        <div className="service-form-header">
          <div className="service-form-title-row">
            <h2 className="service-form-title">{service ? 'Update Service' : 'Add New Service'}</h2>
          </div>
          <button className="service-form-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="service-form">
          <div className="form-group">
            <label htmlFor="service_name" className="form-label">Service Name *</label>
            <input
              type="text"
              id="service_name"
              name="service_name"
              value={formData.service_name}
              onChange={handleChange}
              className={`form-input ${errors.service_name ? 'error' : ''}`}
              placeholder="Enter service name"
            />
            {errors.service_name && <span className="error-message">{errors.service_name}</span>}
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

            <div className="form-group">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select form-select-tight"
              >
                <option value="scheduled">Scheduled</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
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
              placeholder="Enter service description"
              rows="4"
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <p className="form-instruction">
            Please review all entered details before {service ? 'updating' : 'creating'} the service.
          </p>

          {errors.submit && (
            <div className="submit-error">
              <span>{errors.submit}</span>
              <Info size={18} />
            </div>
          )}

          <button
            type="submit"
            className="service-form-button"
            disabled={loading}
          >
            {loading ? (service ? 'Updating...' : 'Creating...') : (service ? 'Update Service' : 'Create Service')}
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

export default ServiceForm;

