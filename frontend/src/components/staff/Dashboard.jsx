import { useState } from 'react';
import Sidebar from './Sidebar';
import Home from './Home';
import Settings from './Settings';
import Residents from '../pages/Residents';
import Households from '../pages/Households';
import Incidents from '../pages/Incidents';
import Services from '../pages/Services';
import Profile from '../pages/Profile';
import { usePersonalisation } from '../../contexts/PersonalisationContext';
import { Copyright } from 'lucide-react';
import '../../assets/style/Dashboard.css';

function Dashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState('dashboard');

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Home />;
      case 'residents':
        return <Residents />;
      case 'households':
        return <Households />;
      case 'incidents':
        return <Incidents />;
      case 'services':
        return <Services />;
      case 'settings':
        return <Settings setActivePage={setActivePage} />;
      case 'profile':
        return <Profile user={user} />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content-wrapper">
        <Sidebar 
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

export default Dashboard;

