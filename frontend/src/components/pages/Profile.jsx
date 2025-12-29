import { useState } from 'react';
import { Lock, UserCircle, ArrowLeft } from 'lucide-react';
import ChangePassword from '../forms/ChangePassword';
import ChangeProfile from '../modals/ChangeProfile';
import '../../assets/style/Profile.css';

function Profile({ user }) {
  const [activeSection, setActiveSection] = useState(null);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1 className="profile-title">Profile</h1>
        <p className="profile-subtitle">Manage your profile settings</p>
      </div>

      <div className="profile-content">
        <div className="profile-options">
          <div
            className="profile-option-card"
            onClick={() => setActiveSection('change-password')}
          >
            <div className="profile-option-icon">
              <Lock size={32} />
            </div>
            <h3 className="profile-option-title">Change Password</h3>
            <p className="profile-option-description">
              Update your account password for better security
            </p>
          </div>

          <div
            className="profile-option-card"
            onClick={() => setActiveSection('change-profile')}
          >
            <div className="profile-option-icon">
              <UserCircle size={32} />
            </div>
            <h3 className="profile-option-title">Update Profile Picture</h3>
            <p className="profile-option-description">
              Change or remove your profile picture
            </p>
          </div>
        </div>
      </div>

      {activeSection === 'change-password' && (
        <div className="profile-section-overlay">
          <div className="profile-section-modal">
            <div className="profile-section-header">
              <button
                className="profile-section-back"
                onClick={() => setActiveSection(null)}
              >
                <ArrowLeft size={20} />
                <span>Back</span>
              </button>
              <h2 className="profile-section-title">Change Password</h2>
            </div>
            <ChangePassword
              userId={user?.id}
              onClose={() => setActiveSection(null)}
            />
          </div>
        </div>
      )}

      {activeSection === 'change-profile' && (
        <ChangeProfile
          user={user}
          onClose={() => setActiveSection(null)}
        />
      )}
    </div>
  );
}

export default Profile;

