import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Info, Search } from 'lucide-react';
import Messages from '../shared/Messages';
import '../../assets/style/BeneficiariesForm.css';

const API_URL = '/api';

function BeneficiariesForm({ serviceId, onClose, onSuccess }) {
  const [availableResidents, setAvailableResidents] = useState([]);
  const [filteredResidents, setFilteredResidents] = useState([]);
  const [selectedResidentIds, setSelectedResidentIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingResidents, setLoadingResidents] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loadingBeneficiaries, setLoadingBeneficiaries] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (serviceId) {
      fetchAvailableResidents();
      fetchBeneficiaries();
    }
  }, [serviceId]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredResidents(availableResidents);
    } else {
      const search = searchTerm.toLowerCase();
      const filtered = availableResidents.filter(resident => {
        const fullName = getFullName(resident).toLowerCase();
        return fullName.includes(search);
      });
      setFilteredResidents(filtered);
    }
  }, [searchTerm, availableResidents]);

  const fetchAvailableResidents = async () => {
    setLoadingResidents(true);
    try {
      const response = await axios.get(`${API_URL}/residents`);
      if (response.data.success) {
        setAvailableResidents(response.data.residents);
        setFilteredResidents(response.data.residents);
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
      const response = await axios.get(`${API_URL}/services/${serviceId}/beneficiaries`);
      if (response.data.success) {
        setBeneficiaries(response.data.beneficiaries);
      }
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
    } finally {
      setLoadingBeneficiaries(false);
    }
  };

  const getFullName = (resident) => {
    const suffix = resident.suffix && resident.suffix !== 'NA' ? ` ${resident.suffix}` : '';
    const mName = resident.m_name ? ` ${resident.m_name}` : '';
    return `${resident.l_name}, ${resident.f_name}${mName}${suffix}`;
  };

  const getAvailableResidentsForSelect = () => {
    const usedResidentIds = beneficiaries.map(b => b.resident_id);
    return filteredResidents.filter(r => !usedResidentIds.includes(r.id));
  };

  const handleCheckboxChange = (residentId) => {
    setSelectedResidentIds(prev => {
      if (prev.includes(residentId)) {
        return prev.filter(id => id !== residentId);
      } else {
        return [...prev, residentId];
      }
    });
    if (errors.selectedResidents) {
      setErrors(prev => ({ ...prev, selectedResidents: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (selectedResidentIds.length === 0) {
      newErrors.selectedResidents = 'Please select at least one resident';
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
      
      const promises = selectedResidentIds.map(residentId =>
        axios.post(`${API_URL}/services/${serviceId}/beneficiaries`, {
          resident_id: residentId,
          userId: user.id
        })
      );

      const results = await Promise.allSettled(promises);
      const successful = results.filter(r => r.status === 'fulfilled' && r.value.data.success);
      const failed = results.filter(r => r.status === 'rejected' || !r.value.data.success);

      if (successful.length > 0) {
        setMessage({ 
          text: `${successful.length} beneficiary${successful.length > 1 ? 'ies' : ''} added successfully`, 
          type: 'success' 
        });
        setSelectedResidentIds([]);
        fetchBeneficiaries();
        fetchAvailableResidents();
        if (onSuccess) {
          onSuccess();
        }
        setTimeout(() => {
          setMessage({ text: '', type: '' });
          onClose();
        }, 2000);
      }

      if (failed.length > 0 && successful.length === 0) {
        setMessage({ 
          text: 'Failed to add beneficiaries. Some may already be added.', 
          type: 'error' 
        });
      } else if (failed.length > 0) {
        setMessage({ 
          text: `${successful.length} added, ${failed.length} failed (may already be added)`, 
          type: 'warning' 
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add beneficiaries';
      setErrors({ submit: errorMessage });
      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="beneficiaries-form-overlay">
      <div className="beneficiaries-form-modal">
        <div className="beneficiaries-form-header">
          <div className="beneficiaries-form-title-row">
            <h2 className="beneficiaries-form-title">Add Beneficiaries</h2>
          </div>
          <button className="beneficiaries-form-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="beneficiaries-form">
          <div className="form-group">
            <label htmlFor="searchResident" className="form-label">Search Residents</label>
            <div className="search-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                id="searchResident"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                placeholder="Search by name..."
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm('')}>
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="residents-list-container">
            <h3 className="residents-list-title">Select Residents</h3>
            {loadingResidents ? (
              <div className="loading-state">Loading residents...</div>
            ) : getAvailableResidentsForSelect().length === 0 ? (
              <div className="no-residents">
                {searchTerm ? 'No residents found matching your search.' : 'No more residents available to add.'}
              </div>
            ) : (
              <div className="residents-list">
                {getAvailableResidentsForSelect().map(resident => (
                  <div key={resident.id} className="resident-item">
                    <input
                      type="checkbox"
                      id={`resident-${resident.id}`}
                      checked={selectedResidentIds.includes(resident.id)}
                      onChange={() => handleCheckboxChange(resident.id)}
                      className="resident-checkbox"
                    />
                    <label htmlFor={`resident-${resident.id}`} className="resident-label">
                      {getFullName(resident)}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {errors.selectedResidents && (
            <div className="error-message-container">
              <span className="error-message">{errors.selectedResidents}</span>
            </div>
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
              className="beneficiaries-form-button"
              disabled={loading || loadingResidents || selectedResidentIds.length === 0}
            >
              {loading ? 'Adding...' : 'Confirm'}
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

export default BeneficiariesForm;
