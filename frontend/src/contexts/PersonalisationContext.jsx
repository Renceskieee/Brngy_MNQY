import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const PersonalisationContext = createContext();

export const usePersonalisation = () => {
  const context = useContext(PersonalisationContext);
  if (!context) {
    throw new Error('usePersonalisation must be used within PersonalisationProvider');
  }
  return context;
};

export const PersonalisationProvider = ({ children }) => {
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPersonalisation();
  }, []);

  const fetchPersonalisation = async () => {
    try {
      const response = await axios.get('/api/personalisation');
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
        applyGlobalStyles(response.data.personalisation);
      }
    } catch (error) {
      console.error('Error fetching personalisation:', error);
      applyGlobalStyles({});
    } finally {
      setLoading(false);
    }
  };

  const applyGlobalStyles = (data) => {
    const root = document.documentElement;
    
    if (data.header_color) {
      root.style.setProperty('--header-bg-color', data.header_color);
    }
    if (data.footer_color) {
      root.style.setProperty('--footer-bg-color', data.footer_color);
    }
    if (data.login_color) {
      root.style.setProperty('--login-color', data.login_color);
    }
    if (data.profile_bg) {
      root.style.setProperty('--profile-bg-color', data.profile_bg);
    }
    if (data.active_nav_color) {
      root.style.setProperty('--active-nav-color', data.active_nav_color);
    }
    if (data.button_color) {
      root.style.setProperty('--button-color', data.button_color);
    }
  };

  return (
    <PersonalisationContext.Provider value={{ personalisation, loading, refresh: fetchPersonalisation }}>
      {children}
    </PersonalisationContext.Provider>
  );
};

