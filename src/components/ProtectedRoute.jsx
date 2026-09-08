import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/auth/me`, { credentials: 'include' })
      .then(res => {
        if (res.ok) setIsAuthenticated(true);
        else setIsAuthenticated(false);
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', 
        fontFamily: 'sans-serif', color: '#999', fontSize: '0.875rem'
      }}>
        Authenticating...
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;
