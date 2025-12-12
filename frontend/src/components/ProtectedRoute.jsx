import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  const location = useLocation();

  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userData);

  // Check if route requires specific role
  if (requiredRole === 'admin' && user.position !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Check if admin tries to access staff dashboard - redirect to admin dashboard
  if (location.pathname === '/dashboard' && user.position === 'admin') {
    return <Navigate to="/dashboard-admin" replace />;
  }

  // Check if staff tries to access admin dashboard - redirect to staff dashboard
  if (location.pathname === '/dashboard-admin' && user.position !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;

