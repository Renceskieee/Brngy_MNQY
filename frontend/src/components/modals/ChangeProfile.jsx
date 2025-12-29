import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Upload, Trash2, UserCircle } from 'lucide-react';
import Messages from '../shared/Messages';
import '../../assets/style/ChangeProfile.css';

const API_URL = '/api';

function ChangeProfile({ user, onClose }) {
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user?.profile_picture) {
      if (user.profile_picture.startsWith('/uploads/')) {
        setPreview(user.profile_picture);
      } else {
        setPreview(`/uploads/profile/${user.profile_picture}`);
      }
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ text: 'File size must be less than 5MB', type: 'error' });
        return;
      }
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!profilePicture) {
      setMessage({ text: 'Please select a file first', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('profile_picture', profilePicture);

      const response = await axios.post(
        `${API_URL}/users/${user.id}/profile-picture`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setMessage({ text: 'Profile picture updated successfully', type: 'success' });
        setProfilePicture(null);
        const profilePath = response.data.user?.profile_picture;
        if (profilePath) {
          setPreview(profilePath);
          const updatedUser = JSON.parse(localStorage.getItem('user') || '{}');
          updatedUser.profile_picture = profilePath;
          localStorage.setItem('user', JSON.stringify(updatedUser));
          window.dispatchEvent(new Event('profileUpdated'));
        }
        setTimeout(() => {
          if (onClose) onClose();
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to upload profile picture';
      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!window.confirm('Are you sure you want to remove your profile picture?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.delete(`${API_URL}/users/${user.id}/profile-picture`);

      if (response.data.success) {
        setMessage({ text: 'Profile picture removed successfully', type: 'success' });
        setPreview(null);
        setProfilePicture(null);
        const updatedUser = JSON.parse(localStorage.getItem('user') || '{}');
        updatedUser.profile_picture = null;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('profileUpdated'));
        setTimeout(() => {
          if (onClose) onClose();
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to remove profile picture';
      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-profile-overlay">
      <div className="change-profile-modal">
        <div className="change-profile-header">
          <h2 className="change-profile-title">Update Profile Picture</h2>
          <button className="change-profile-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="change-profile-content">
          <div className="profile-picture-preview">
            {preview ? (
              <img src={preview} alt="Profile Preview" />
            ) : (
              <div className="profile-picture-placeholder">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
            )}
          </div>

          <div className="profile-picture-actions">
            <label htmlFor="profile-picture-input" className="upload-button">
              <Upload size={18} />
              <span>Choose File</span>
              <input
                id="profile-picture-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>

            {preview && (
              <button
                className="remove-button"
                onClick={handleRemove}
                disabled={loading}
              >
                <Trash2 size={18} />
                <span>Remove</span>
              </button>
            )}

            {profilePicture && (
              <button
                className="save-button"
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Save Changes'}
              </button>
            )}
          </div>

          <p className="profile-picture-hint">
            Supported formats: JPG, PNG, GIF, WEBP (Max 5MB)
          </p>
        </div>

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

export default ChangeProfile;

