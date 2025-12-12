import { useState } from 'react';
import Sidebar from './Sidebar';
import Home from './Home';
import Settings from './Settings';
import '../../assets/style/Dashboard.css';

function Dashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState('dashboard');

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Home />;
      case 'settings':
        return <Settings />;
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

export default Dashboard;

