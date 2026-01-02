import { useState } from 'react';
import { MonitorCog, UserRoundPlus, UserRoundCog, UserRound, Clock } from 'lucide-react';
import CreateAccount from '../forms/CreateAccount';
import '../../assets/style/SettingsAdmin.css';

function SettingsAdmin({ setActivePage }) {
  const [activeModal, setActiveModal] = useState(null);

  const settingsCards = [
    {
      id: 'personalisation',
      icon: MonitorCog,
      title: 'Personalisation',
      description: 'Customize your interface with themes, layout options, and display preferences.'
    },
    {
      id: 'create-account',
      icon: UserRoundPlus,
      title: 'Create Account',
      description: 'Add new users and set up their account details.'
    },
    {
      id: 'user-settings',
      icon: UserRoundCog,
      title: 'User Settings',
      description: 'Manage user accounts, update details, reset passwords, and view profiles.'
    },
    {
      id: 'profile',
      icon: UserRound,
      title: 'Profile',
      description: 'Update your profile picture and change your password.'
    },
    {
      id: 'time-log',
      icon: Clock,
      title: 'Time Log',
      description: 'View and manage user login and logout times.'
    }
  ];

  return (
    <div className="settings-admin">
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
                if (card.id === 'create-account') {
                  setActiveModal('create-account');
                } else if (card.id === 'personalisation') {
                  if (setActivePage) {
                    setActivePage('personalise');
                  }
                } else if (card.id === 'user-settings') {
                  if (setActivePage) {
                    setActivePage('users');
                  }
                } else if (card.id === 'profile') {
                  if (setActivePage) {
                    setActivePage('profile');
                  }
                } else if (card.id === 'time-log') {
                  if (setActivePage) {
                    setActivePage('time-log');
                  }
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

      {activeModal === 'create-account' && (
        <CreateAccount onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}

export default SettingsAdmin;

