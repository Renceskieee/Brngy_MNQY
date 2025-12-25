import { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, X, Trash2, MoveUp, MoveDown, Save, RotateCcw } from 'lucide-react';
import Messages from '../shared/Messages';
import { usePersonalisation } from '../../contexts/PersonalisationContext';
import '../../assets/style/Personalise.css';

const API_URL = '/api';

function Personalise() {
  const { personalisation: contextPersonalisation, refresh } = usePersonalisation();
  const [personalisation, setPersonalisation] = useState({
    logo: null,
    main_bg: null,
    header_title: '',
    header_color: '#ffffff',
    footer_title: '',
    footer_color: '#f3f4f6',
    login_color: '#dc2626',
    profile_bg: '#e5e7eb',
    active_nav_color: '#dc2626',
    button_color: '#dc2626'
  });
  const [carousel, setCarousel] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [logoPreview, setLogoPreview] = useState(null);
  const [mainBgPreview, setMainBgPreview] = useState(null);
  const [carouselPreview, setCarouselPreview] = useState(null);

  useEffect(() => {
    if (contextPersonalisation && contextPersonalisation.header_color) {
      setPersonalisation(contextPersonalisation);
      if (contextPersonalisation.logo) {
        setLogoPreview(contextPersonalisation.logo);
      }
      if (contextPersonalisation.main_bg) {
        setMainBgPreview(contextPersonalisation.main_bg);
      }
    }
    fetchCarousel();
  }, [contextPersonalisation]);

  const fetchPersonalisation = async () => {
    try {
      const response = await axios.get(`${API_URL}/personalisation`);
      if (response.data.success) {
        const data = response.data.personalisation;
        setPersonalisation({
          logo: data.logo || null,
          main_bg: data.main_bg || null,
          header_title: data.header_title || '',
          header_color: data.header_color || '#ffffff',
          footer_title: data.footer_title || '',
          footer_color: data.footer_color || '#f3f4f6',
          login_color: data.login_color || '#dc2626',
          profile_bg: data.profile_bg || '#e5e7eb',
          active_nav_color: data.active_nav_color || '#dc2626',
          button_color: data.button_color || '#dc2626'
        });
        if (data.logo) {
          setLogoPreview(data.logo);
        }
        if (data.main_bg) {
          setMainBgPreview(data.main_bg);
        }
      }
    } catch (error) {
      console.error('Error fetching personalisation:', error);
      setMessage({ text: 'Failed to load personalisation settings', type: 'error' });
    }
  };

  const fetchCarousel = async () => {
    try {
      const response = await axios.get(`${API_URL}/carousel`);
      if (response.data.success) {
        setCarousel(response.data.carousel);
      }
    } catch (error) {
      console.error('Error fetching carousel:', error);
      setMessage({ text: 'Failed to load carousel images', type: 'error' });
    }
  };

  const handleInputChange = (field, value) => {
    setPersonalisation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ text: 'Please select an image file', type: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('logo', file);

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/personalisation/logo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setPersonalisation(prev => ({ ...prev, logo: response.data.personalisation.logo }));
        setLogoPreview(response.data.personalisation.logo);
        setMessage({ text: 'Logo uploaded successfully', type: 'success' });
        if (refresh) {
          refresh();
        }
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Failed to upload logo', type: 'error' });
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleMainBgUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ text: 'Please select an image file', type: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('main_bg', file);

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/personalisation/main-bg`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setPersonalisation(prev => ({ ...prev, main_bg: response.data.personalisation.main_bg }));
        setMainBgPreview(response.data.personalisation.main_bg);
        setMessage({ text: 'Background image uploaded successfully', type: 'success' });
        if (refresh) {
          refresh();
        }
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Failed to upload background image', type: 'error' });
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleResetDefault = async () => {
    if (window.confirm('Are you sure you want to reset all personalisation settings to default values?')) {
      const defaultValues = {
        logo: null,
        main_bg: null,
        header_title: '',
        header_color: '#ffffff',
        footer_title: '',
        footer_color: '#f3f4f6',
        login_color: '#dc2626',
        profile_bg: '#e5e7eb',
        active_nav_color: '#dc2626',
        button_color: '#dc2626'
      };
      
      setSaving(true);
      try {
        const response = await axios.put(`${API_URL}/personalisation`, defaultValues);
        if (response.data.success) {
          setPersonalisation(defaultValues);
          setLogoPreview(null);
          setMainBgPreview(null);
          setMessage({ text: 'Settings reset to default values', type: 'success' });
          if (refresh) {
            refresh();
          }
        }
      } catch (error) {
        setMessage({ text: error.response?.data?.message || 'Failed to reset settings', type: 'error' });
      } finally {
        setSaving(false);
      }
    }
  };

  const handleSavePersonalisation = async () => {
    setSaving(true);
    try {
      const response = await axios.put(`${API_URL}/personalisation`, personalisation);
      if (response.data.success) {
        setMessage({ text: 'Personalisation settings saved successfully', type: 'success' });
        if (refresh) {
          refresh();
        }
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Failed to save settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCarouselUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ text: 'Please select an image file', type: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('carousel', file);
    formData.append('position', carousel.length + 1);

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/carousel`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        fetchCarousel();
        setMessage({ text: 'Carousel image added successfully', type: 'success' });
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Failed to upload image', type: 'error' });
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleDeleteCarousel = async (id) => {
    if (!window.confirm('Are you sure you want to delete this carousel image?')) {
      return;
    }

    try {
      const response = await axios.delete(`${API_URL}/carousel/${id}`);
      if (response.data.success) {
        fetchCarousel();
        setMessage({ text: 'Carousel image deleted successfully', type: 'success' });
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Failed to delete image', type: 'error' });
    }
  };

  const handleMoveCarousel = async (id, direction) => {
    const currentIndex = carousel.findIndex(item => item.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= carousel.length) return;

    const targetItem = carousel[newIndex];
    const currentPosition = carousel[currentIndex].position;
    const targetPosition = targetItem.position;

    try {
      await axios.put(`${API_URL}/carousel/${id}/position`, { position: targetPosition });
      await axios.put(`${API_URL}/carousel/${targetItem.id}/position`, { position: currentPosition });
      fetchCarousel();
    } catch (error) {
      setMessage({ text: 'Failed to reorder carousel images', type: 'error' });
    }
  };

  return (
    <div className="personalise">
      <div className="personalise-header">
        <h1 className="personalise-title">Personalisation</h1>
        <p className="personalise-subtitle">Customize your system appearance and branding</p>
      </div>

      <div className="personalise-content">
        <div className="personalise-section">
          <h2 className="section-title">Logo Settings</h2>
          <div className="logo-section">
            <div className="logo-preview-container">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="logo-preview" />
              ) : (
                <div className="logo-placeholder">No logo uploaded</div>
              )}
            </div>
            <label className="upload-button">
              <Upload size={20} />
              <span>Upload Logo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={loading}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        <div className="personalise-section">
          <h2 className="section-title">Login Page Background</h2>
          <div className="logo-section">
            <div className="logo-preview-container">
              {mainBgPreview ? (
                <img src={mainBgPreview} alt="Background" className="logo-preview" />
              ) : (
                <div className="logo-placeholder">No background uploaded</div>
              )}
            </div>
            <label className="upload-button">
              <Upload size={20} />
              <span>Upload Background</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleMainBgUpload}
                disabled={loading}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        <div className="personalise-section">
          <h2 className="section-title">Header Settings</h2>
          <div className="form-group">
            <label className="form-label">Header Title</label>
            <input
              type="text"
              className="form-input"
              value={personalisation.header_title}
              onChange={(e) => handleInputChange('header_title', e.target.value)}
              placeholder="Enter header title"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Header Background Color</label>
            <div className="color-input-group">
              <input
                type="color"
                className="color-picker"
                value={personalisation.header_color}
                onChange={(e) => handleInputChange('header_color', e.target.value)}
              />
              <input
                type="text"
                className="color-text-input"
                value={personalisation.header_color}
                onChange={(e) => handleInputChange('header_color', e.target.value)}
                placeholder="#ffffff"
              />
            </div>
          </div>
        </div>

        <div className="personalise-section">
          <h2 className="section-title">Footer Settings</h2>
          <div className="form-group">
            <label className="form-label">Footer Title</label>
            <input
              type="text"
              className="form-input"
              value={personalisation.footer_title}
              onChange={(e) => handleInputChange('footer_title', e.target.value)}
              placeholder="Enter footer title"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Footer Background Color</label>
            <div className="color-input-group">
              <input
                type="color"
                className="color-picker"
                value={personalisation.footer_color}
                onChange={(e) => handleInputChange('footer_color', e.target.value)}
              />
              <input
                type="text"
                className="color-text-input"
                value={personalisation.footer_color}
                onChange={(e) => handleInputChange('footer_color', e.target.value)}
                placeholder="#f3f4f6"
              />
            </div>
          </div>
        </div>

        <div className="personalise-section">
          <h2 className="section-title">Text Color Settings</h2>
          <div className="form-group">
            <label className="form-label">Text Color</label>
            <div className="color-input-group">
              <input
                type="color"
                className="color-picker"
                value={personalisation.login_color}
                onChange={(e) => handleInputChange('login_color', e.target.value)}
              />
              <input
                type="text"
                className="color-text-input"
                value={personalisation.login_color}
                onChange={(e) => handleInputChange('login_color', e.target.value)}
                placeholder="#dc2626"
              />
            </div>
            <p className="form-help">Applies to header title, footer text, etc.</p>
          </div>
        </div>

        <div className="personalise-section">
          <h2 className="section-title">Profile Settings</h2>
          <div className="form-group">
            <label className="form-label">Profile Background Color</label>
            <div className="color-input-group">
              <input
                type="color"
                className="color-picker"
                value={personalisation.profile_bg}
                onChange={(e) => handleInputChange('profile_bg', e.target.value)}
              />
              <input
                type="text"
                className="color-text-input"
                value={personalisation.profile_bg}
                onChange={(e) => handleInputChange('profile_bg', e.target.value)}
                placeholder="#e5e7eb"
              />
            </div>
            <p className="form-help">Default background color when no user image is uploaded</p>
          </div>
        </div>

        <div className="personalise-section">
          <h2 className="section-title">Navigation Settings</h2>
          <div className="form-group">
            <label className="form-label">Active Navigation Color</label>
            <div className="color-input-group">
              <input
                type="color"
                className="color-picker"
                value={personalisation.active_nav_color}
                onChange={(e) => handleInputChange('active_nav_color', e.target.value)}
              />
              <input
                type="text"
                className="color-text-input"
                value={personalisation.active_nav_color}
                onChange={(e) => handleInputChange('active_nav_color', e.target.value)}
                placeholder="#dc2626"
              />
            </div>
          </div>
        </div>

        <div className="personalise-section">
          <h2 className="section-title">Button Settings</h2>
          <div className="form-group">
            <label className="form-label">Button Color</label>
            <div className="color-input-group">
              <input
                type="color"
                className="color-picker"
                value={personalisation.button_color}
                onChange={(e) => handleInputChange('button_color', e.target.value)}
              />
              <input
                type="text"
                className="color-text-input"
                value={personalisation.button_color}
                onChange={(e) => handleInputChange('button_color', e.target.value)}
                placeholder="#dc2626"
              />
            </div>
            <p className="form-help">Global button color styling</p>
          </div>
        </div>

        <div className="personalise-section">
          <h2 className="section-title">Carousel Management</h2>
          <p className="section-description">Manage images displayed on the Login page</p>
          
          <label className="upload-button">
            <Upload size={20} />
            <span>Add Carousel Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleCarouselUpload}
              disabled={loading}
              style={{ display: 'none' }}
            />
          </label>

          <div className="carousel-list">
            {carousel.map((item, index) => (
              <div key={item.id} className="carousel-item">
                <img src={item.picture} alt={`Carousel ${item.id}`} className="carousel-item-image" />
                <div className="carousel-item-actions">
                  <button
                    className="carousel-action-btn"
                    onClick={() => handleMoveCarousel(item.id, 'up')}
                    disabled={index === 0}
                    title="Move up"
                  >
                    <MoveUp size={16} />
                  </button>
                  <button
                    className="carousel-action-btn"
                    onClick={() => handleMoveCarousel(item.id, 'down')}
                    disabled={index === carousel.length - 1}
                    title="Move down"
                  >
                    <MoveDown size={16} />
                  </button>
                  <button
                    className="carousel-action-btn delete"
                    onClick={() => handleDeleteCarousel(item.id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {carousel.length === 0 && (
              <p className="empty-state">No carousel images. Add one to get started.</p>
            )}
          </div>
        </div>

        <div className="personalise-actions">
          <button
            className="reset-button"
            onClick={handleResetDefault}
            disabled={saving || loading}
          >
            <RotateCcw size={20} />
            <span>Default / Reset</span>
          </button>
          <button
            className="save-button"
            onClick={handleSavePersonalisation}
            disabled={saving || loading}
          >
            <Save size={20} />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {message.text && (
        <Messages
          message={message.text}
          type={message.type}
          onClose={() => setMessage({ text: '', type: '' })}
        />
      )}
    </div>
  );
}

export default Personalise;
