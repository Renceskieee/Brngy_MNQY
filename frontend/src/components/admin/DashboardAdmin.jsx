import { useState } from 'react';
import SidebarAdmin from './SidebarAdmin';
import HomeAdmin from './HomeAdmin';
import SettingsAdmin from './SettingsAdmin';
import Personalise from './Personalise';
import Residents from '../pages/Residents';
import Households from '../pages/Households';
import Profile from '../pages/Profile';
import TimeLog from '../pages/TimeLog';
import { usePersonalisation } from '../../contexts/PersonalisationContext';
import { Copyright } from 'lucide-react';
import '../../assets/style/DashboardAdmin.css';

function DashboardAdmin({ user, onLogout }) {
  const [activePage, setActivePage] = useState('dashboard');

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <HomeAdmin />;
      case 'residents':
        return <Residents />;
      case 'households':
        return <Households />;
      case 'settings':
        return <SettingsAdmin setActivePage={setActivePage} />;
      case 'personalise':
        return <Personalise />;
      case 'profile':
        return <Profile user={user} />;
      case 'time-log':
        return <TimeLog />;
      default:
        return <HomeAdmin />;
    }
  };

  return (
    <div className="dashboard-admin-container">
      <Header />
      <div className="dashboard-content-wrapper">
        <SidebarAdmin 
          activePage={activePage} 
          setActivePage={setActivePage}
          user={user}
          onLogout={onLogout}
        />
        <main className="dashboard-main-content">
          {renderContent()}
        </main>
      </div>
      <Footer />
    </div>
  );
}

function Header() {
  const { personalisation } = usePersonalisation();
  return (
    <header className="app-header">
      <div className="header-content">
        {personalisation?.logo && (
          <img 
            src={personalisation.logo} 
            alt="Logo" 
            className="header-logo"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
        <h1 className="header-title">{personalisation?.header_title || 'Sangguniang Kabataan – NBBS Dagat-Dagatan'}</h1>
      </div>
    </header>
  );
}

function Footer() {
  const { personalisation } = usePersonalisation();
  return (
    <footer className="app-footer">
      <p>
        <Copyright size={14} style={{ display: 'inline', marginRight: '4px' }} />
        {personalisation?.footer_title || 'SK Barangay Information System 2025'}
      </p>
    </footer>
  );
}

export default DashboardAdmin;

