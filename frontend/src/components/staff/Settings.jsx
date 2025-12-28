import { useState } from 'react';
import { UserRound } from 'lucide-react';
import '../../assets/style/Settings.css';

function Settings() {
  const [activeModal, setActiveModal] = useState(null);

  const settingsCards = [
    {
      id: 'profile',
      icon: UserRound,
      title: 'Profile',
      description: 'Update your profile picture and change your password.'
    }
  ];

  return (
    <div className="settings">
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
      </div>

      <div className="settings-grid">
        {settingsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="settings-card"
              onClick={() => {
                if (card.id === 'profile') {
                  setActiveModal('profile');
                }
              }}
            >
              <div className="settings-card-icon">
                <Icon size={32} />
              </div>
              <h3 className="settings-card-title">{card.title}</h3>
              <p className="settings-card-description">{card.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Settings;
