import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardAdmin from './components/admin/DashboardAdmin';
import Dashboard from './components/staff/Dashboard';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData.id) {
        const response = await axios.get('/api/time-logs', {
          params: { userId: userData.id, limit: 1 }
        });
        if (response.data.success && response.data.timeLogs.length > 0) {
          const latestLog = response.data.timeLogs[0];
          if (latestLog.id && !latestLog.logged_out) {
            await axios.put(`/api/time-logs/${latestLog.id}`, {
              logged_out: new Date().toISOString()
            });
          }
        }
      }
    } catch (error) {
      console.error('Error recording logout time:', error);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? (
                <Navigate to={user?.position === 'admin' ? '/dashboard-admin' : '/dashboard'} replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            } 
          />
          <Route
            path="/dashboard-admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <DashboardAdmin user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
