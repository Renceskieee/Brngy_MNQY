import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, Info, Upload, Camera, Trash2 } from 'lucide-react';
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
    educ_background: '',
    work_status: '',
    youth_classification: '',
    contact_no: '',
    email: '',
    address: ''
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const calculateAge = (birthdate) => {
    if (!birthdate) return null;
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const isYouthAge = () => {
    const age = calculateAge(formData.birthdate);
    return age !== null && age >= 15 && age <= 30;
  };

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
        educ_background: resident.educ_background || '',
        work_status: resident.work_status || '',
        youth_classification: resident.youth_classification || '',
        contact_no: resident.contact_no || '',
        email: resident.email || '',
        address: resident.address || ''
      });
      if (resident.profile) {
        setProfilePreview(resident.profile.startsWith('/uploads/') ? resident.profile : `/uploads/residents/${resident.profile}`);
      }
    }
  }, [resident]);

  useEffect(() => {
    if (!isYouthAge() && formData.youth_classification) {
      setFormData(prev => ({ ...prev, youth_classification: '' }));
    }
  }, [formData.birthdate]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ text: 'File size must be less than 5MB', type: 'error' });
        return;
      }
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (error) {
      setMessage({ text: 'Unable to access camera', type: 'error' });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        const file = new File([blob], 'profile-capture.jpg', { type: 'image/jpeg' });
        setProfilePicture(file);
        setProfilePreview(URL.createObjectURL(blob));
        stopCamera();
      }, 'image/jpeg', 0.9);
    }
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
    setProfilePreview(null);
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
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      formDataToSend.append('userId', user.id);
      
      if (profilePicture) {
        formDataToSend.append('profile', profilePicture);
      }

      let response;
      if (resident) {
        response = await axios.put(`${API_URL}/residents/${resident.id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axios.post(`${API_URL}/residents`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
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
            educ_background: '',
            work_status: '',
            youth_classification: '',
            contact_no: '',
            email: '',
            address: ''
          });
          setProfilePicture(null);
          setProfilePreview(null);
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
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Profile Picture</label>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              {profilePreview ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img 
                    src={profilePreview} 
                    alt="Profile Preview" 
                    style={{ 
                      width: '120px', 
                      height: '120px', 
                      borderRadius: '50%', 
                      objectFit: 'cover',
                      border: '3px solid #e5e7eb'
                    }} 
                  />
                  <button
                    type="button"
                    onClick={removeProfilePicture}
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9ca3af',
                  fontSize: '14px',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  No Photo
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px' }}>
                <label style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '500'
                }}>
                  <Upload size={16} />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </label>
                <button
                  type="button"
                  onClick={showCamera ? stopCamera : startCamera}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    background: showCamera ? '#dc2626' : '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: '500'
                  }}
                >
                  <Camera size={16} />
                  {showCamera ? 'Stop Camera' : 'Camera'}
                </button>
              </div>
              {showCamera && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    style={{
                      width: '100%',
                      maxWidth: '300px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb'
                    }}
                  />
                  <button
                    type="button"
                    onClick={capturePhoto}
                    style={{
                      padding: '10px 20px',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: '600'
                    }}
                  >
                    Capture Photo
                  </button>
                </div>
              )}
            </div>
          </div>

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
              <option value="annulled">Annulled</option>
              <option value="divorced">Divorced</option>
              <option value="live-in">Live-in</option>
              <option value="unknown">Unknown</option>
            </select>
            {errors.civil_status && <span className="error-message">{errors.civil_status}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="educ_background" className="form-label">Educational Background</label>
            <select
              id="educ_background"
              name="educ_background"
              value={formData.educ_background}
              onChange={handleChange}
              className={`form-select ${errors.educ_background ? 'error' : ''}`}
            >
              <option value="">Select educational background</option>
              <option value="Elementary Level">Elementary Level</option>
              <option value="Elementary Graduate">Elementary Graduate</option>
              <option value="High School Level">High School Level</option>
              <option value="High School Graduate">High School Graduate</option>
              <option value="Vocational Graduate">Vocational Graduate</option>
              <option value="College Level">College Level</option>
              <option value="College Graduate">College Graduate</option>
              <option value="Masters Level">Masters Level</option>
              <option value="Masters Graduate">Masters Graduate</option>
              <option value="Doctorate Level">Doctorate Level</option>
              <option value="Doctorate Graduate">Doctorate Graduate</option>
            </select>
            {errors.educ_background && <span className="error-message">{errors.educ_background}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="work_status" className="form-label">Work Status</label>
            <select
              id="work_status"
              name="work_status"
              value={formData.work_status}
              onChange={handleChange}
              className={`form-select ${errors.work_status ? 'error' : ''}`}
            >
              <option value="">Select work status</option>
              <option value="Employed">Employed</option>
              <option value="Unemployed">Unemployed</option>
              <option value="Self-Employed">Self-Employed</option>
              <option value="Currently looking for a job">Currently looking for a job</option>
              <option value="Not interested looking for a job">Not interested looking for a job</option>
            </select>
            {errors.work_status && <span className="error-message">{errors.work_status}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="youth_classification" className="form-label">
              Youth Classification
              {!isYouthAge() && formData.birthdate && (
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'normal', marginLeft: '8px' }}>
                  (Available for ages 15-30 only)
                </span>
              )}
            </label>
            <select
              id="youth_classification"
              name="youth_classification"
              value={formData.youth_classification}
              onChange={handleChange}
              disabled={!isYouthAge()}
              className={`form-select ${errors.youth_classification ? 'error' : ''} ${!isYouthAge() ? 'disabled' : ''}`}
            >
              <option value="">Select youth classification</option>
              <option value="In School Youth">In School Youth</option>
              <option value="Out of School Youth">Out of School Youth</option>
              <option value="Working Youth">Working Youth</option>
              <option value="Youth w/ Specific Needs">Youth w/ Specific Needs</option>
              <option value="Indigenous People">Indigenous People</option>
              <option value="Children In Conflict w/ Law">Children In Conflict w/ Law</option>
              <option value="Person w/ Disability">Person w/ Disability</option>
            </select>
            {errors.youth_classification && <span className="error-message">{errors.youth_classification}</span>}
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
              placeholder="Enter home address"
              rows="3"
            />
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', fontFamily: 'Poppins, sans-serif' }}>
              <i>(House No., Street, Barangay, City, Region, ZIP Code)</i>
            </div>
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
