import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Plus, Trash2, Info } from 'lucide-react';
import Messages from '../shared/Messages';
import '../../assets/style/HouseholdForm.css';

const API_URL = '/api';

function HouseholdForm({ onClose, household = null, onSuccess }) {
  const [formData, setFormData] = useState({
    household_name: '',
    address: ''
  });
  const [members, setMembers] = useState([]);
  const [availableResidents, setAvailableResidents] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loadingResidents, setLoadingResidents] = useState(false);

  useEffect(() => {
    fetchAvailableResidents();
    if (household) {
      setFormData({
        household_name: household.household_name || '',
        address: household.address || ''
      });
      if (!household.members && household.id) {
        fetchHouseholdDetails(household.id);
      } else if (household.members) {
        setMembers(household.members.map(m => ({
          resident_id: m.resident_id ? String(m.resident_id) : '',
          role: m.role || 'member'
        })));
      }
    }
  }, [household]);

  const fetchHouseholdDetails = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/households/${id}`);
      if (response.data.success && response.data.household.members) {
        setMembers(response.data.household.members.map(m => ({
          resident_id: m.resident_id ? String(m.resident_id) : '',
          role: m.role || 'member'
        })));
      }
    } catch (error) {
      console.error('Error fetching household details:', error);
    }
  };

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

  const handleAddMember = () => {
    setMembers([...members, { resident_id: '', role: 'member' }]);
  };

  const handleRemoveMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...members];
    if (field === 'resident_id') {
      updatedMembers[index][field] = value === '' ? '' : parseInt(value);
    } else {
      updatedMembers[index][field] = value;
    }
    setMembers(updatedMembers);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.household_name.trim()) {
      newErrors.household_name = 'Household name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (members.length > 0) {
      for (let i = 0; i < members.length; i++) {
        if (!members[i].resident_id) {
          newErrors[`member_${i}`] = 'Please select a resident';
        }
        if (!members[i].role) {
          newErrors[`member_role_${i}`] = 'Please select a role';
        }
      }

      const residentIds = members.map(m => parseInt(m.resident_id)).filter(id => id);
      const uniqueIds = new Set(residentIds);
      if (residentIds.length !== uniqueIds.size) {
        newErrors.members = 'Duplicate residents are not allowed';
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
      const requestData = {
        ...formData,
        members: household ? members.filter(m => m.resident_id) : [],
        userId: user.id
      };

      let response;
      if (household) {
        response = await axios.put(`${API_URL}/households/${household.id}`, requestData);
      } else {
        response = await axios.post(`${API_URL}/households`, requestData);
      }

      if (response.data.success) {
        setMessage({ 
          text: household ? 'Household updated successfully' : 'Household created successfully', 
          type: 'success' 
        });
        setTimeout(() => {
          setFormData({
            household_name: '',
            address: ''
          });
          setMembers([]);
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
      const errorMessage = error.response?.data?.message || (household ? 'Failed to update household' : 'Failed to create household');
      setErrors({ submit: errorMessage });
      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getResidentName = (residentId) => {
    const resident = availableResidents.find(r => r.id === parseInt(residentId));
    if (!resident) return '';
    const suffix = resident.suffix && resident.suffix !== 'NA' ? ` ${resident.suffix}` : '';
    const mName = resident.m_name ? ` ${resident.m_name}` : '';
    return `${resident.l_name}, ${resident.f_name}${mName}${suffix}`;
  };

  const getAvailableResidentsForSelect = (currentResidentId) => {
    const usedResidentIds = members.map(m => parseInt(m.resident_id)).filter(id => id);
    return availableResidents.filter(r => {
      if (currentResidentId && parseInt(currentResidentId) === r.id) return true;
      if (household && household.members) {
        const existingMember = household.members.find(m => parseInt(m.resident_id) === r.id);
        return !usedResidentIds.includes(r.id) || !!existingMember;
      }
      return !usedResidentIds.includes(r.id);
    });
  };

  return (
    <div className="household-form-overlay">
      <div className="household-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="household-form-header">
          <div className="household-form-title-row">
            <h2 className="household-form-title">{household ? 'Update Household' : 'Add New Household'}</h2>
            <hr className="household-form-divider" />
          </div>
          <button className="household-form-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="household-form">
          <div className="form-group">
            <label htmlFor="household_name" className="form-label">Household Name *</label>
            <input
              type="text"
              id="household_name"
              name="household_name"
              value={formData.household_name}
              onChange={handleChange}
              className={`form-input ${errors.household_name ? 'error' : ''}`}
              placeholder="Enter household name"
            />
            {errors.household_name && <span className="error-message">{errors.household_name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address" className="form-label">Address *</label>
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

          {household && (
            <div className="members-section">
              <div className="members-header">
                <h3 className="members-title">Household Members</h3>
                <button
                  type="button"
                  className="add-member-btn"
                  onClick={handleAddMember}
                >
                  <Plus size={18} />
                  <span>Add Member</span>
                </button>
              </div>

              {errors.members && (
                <div className="error-message">{errors.members}</div>
              )}

              {members.length === 0 ? (
                <p className="no-members-message">No members added yet. Click "Add Member" to add residents to this household.</p>
              ) : (
              <div className="members-list">
                {members.map((member, index) => (
                  <div key={index} className="member-item">
                    <div className="member-fields">
                      <div className="form-group member-resident">
                        <label className="form-label">Resident *</label>
                        <select
                          value={member.resident_id ? String(member.resident_id) : ''}
                          onChange={(e) => handleMemberChange(index, 'resident_id', e.target.value)}
                          className={`form-select ${errors[`member_${index}`] ? 'error' : ''}`}
                        >
                          <option value="">Select resident</option>
                          {getAvailableResidentsForSelect(member.resident_id).map(resident => {
                            const suffix = resident.suffix && resident.suffix !== 'NA' ? ` ${resident.suffix}` : '';
                            const mName = resident.m_name ? ` ${resident.m_name}` : '';
                            const fullName = `${resident.l_name}, ${resident.f_name}${mName}${suffix}`;
                            return (
                              <option key={resident.id} value={String(resident.id)}>
                                {fullName}
                              </option>
                            );
                          })}
                        </select>
                        {errors[`member_${index}`] && (
                          <span className="error-message">{errors[`member_${index}`]}</span>
                        )}
                      </div>

                      <div className="form-group member-role">
                        <label className="form-label">Role *</label>
                        <select
                          value={member.role}
                          onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                          className={`form-select ${errors[`member_role_${index}`] ? 'error' : ''}`}
                        >
                          <option value="head">Head</option>
                          <option value="member">Member</option>
                          <option value="dependent">Dependent</option>
                        </select>
                        {errors[`member_role_${index}`] && (
                          <span className="error-message">{errors[`member_role_${index}`]}</span>
                        )}
                      </div>

                      <button
                        type="button"
                        className="remove-member-btn"
                        onClick={() => handleRemoveMember(index)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>
          )}

          <p className="form-instruction">
            Please review all entered details before {household ? 'updating' : 'creating'} the household.
          </p>

          {errors.submit && (
            <div className="submit-error">
              <span>{errors.submit}</span>
              <Info size={18} />
            </div>
          )}

          <button
            type="submit"
            className="household-form-button"
            disabled={loading || loadingResidents}
          >
            {loading ? (household ? 'Updating...' : 'Creating...') : (household ? 'Update Household' : 'Create Household')}
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

export default HouseholdForm;

