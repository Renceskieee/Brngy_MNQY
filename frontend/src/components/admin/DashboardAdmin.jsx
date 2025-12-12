import { useState } from 'react';
import SidebarAdmin from './SidebarAdmin';
import HomeAdmin from './HomeAdmin';
import SettingsAdmin from './SettingsAdmin';
import Personalise from './Personalise';
import '../../assets/style/DashboardAdmin.css';

function DashboardAdmin({ user, onLogout }) {
  const [activePage, setActivePage] = useState('dashboard');

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <HomeAdmin />;
      case 'settings':
        return <SettingsAdmin />;
      case 'personalise':
        return <Personalise />;
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
  return (
    <header className="app-header">
      <div className="header-content">
        <img 
          src="/uploads/logo/SK-NBBS_logo.png" 
          alt="SK Logo" 
          className="header-logo"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <h1 className="header-title">Sangguniang Kabataan – NBBS Dagat-Dagatan</h1>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="app-footer">
      <p>© SK Barangay Information System 2025</p>
    </footer>
  );
}

export default DashboardAdmin;

