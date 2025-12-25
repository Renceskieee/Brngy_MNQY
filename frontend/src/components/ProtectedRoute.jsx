import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  const location = useLocation();

  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userData);

  if (requiredRole === 'admin' && user.position !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (location.pathname === '/dashboard' && user.position === 'admin') {
    return <Navigate to="/dashboard-admin" replace />;
  }

  if (location.pathname === '/dashboard-admin' && user.position !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;

