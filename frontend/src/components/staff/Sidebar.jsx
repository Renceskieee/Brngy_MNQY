import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Home,
  OctagonAlert,
  Heart,
  Download,
  Settings,
  LogOut
} from 'lucide-react';
import '../../assets/style/Sidebar.css';

function Sidebar({ activePage, setActivePage, user, onLogout }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'residents', icon: Users, label: 'Residents' },
    { id: 'households', icon: Home, label: 'Households' },
    { id: 'incidents', icon: OctagonAlert, label: 'Incidents' },
    { id: 'services', icon: Heart, label: 'Services' },
    { id: 'certificates', icon: Download, label: 'Certificates' },
  ];

  const bottomItems = [
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'logout', icon: LogOut, label: 'Log out', action: onLogout }
  ];

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-profile">
        <div className="sidebar-avatar">
          {user?.profile_picture ? (
            <img 
              src={`/uploads/profile/${user.profile_picture}`} 
              alt="Profile" 
              onError={(e) => {
                e.target.src = '/uploads/profile/default.png';
              }}
            />
          ) : (
            <div className="avatar-placeholder">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
          )}
        </div>
        <div className="sidebar-user-info">
          <p className="sidebar-user-name">
            {user?.first_name} {user?.last_name}
          </p>
          <p className="sidebar-user-role">(Staff)</p>
        </div>
      </div>

      <div className="sidebar-divider"></div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`sidebar-nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-divider"></div>

      <nav className="sidebar-nav">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`sidebar-nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => {
                if (item.action) {
                  handleLogout();
                } else {
                  setActivePage(item.id);
                }
              }}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h3 className="logout-modal-title">Confirm Logout</h3>
            <p className="logout-modal-message">Are you sure you want to log out?</p>
            <div className="logout-modal-actions">
              <button className="logout-modal-cancel" onClick={cancelLogout}>
                Cancel
              </button>
              <button className="logout-modal-confirm" onClick={confirmLogout}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;

