import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';

function ProtectedAdminRoute() {
  const token = localStorage.getItem('adminToken');
  
  useEffect(() => {
    if (token) {
      // Verify token with backend
      fetch(`${process.env.REACT_APP_API_URL}/api/admin/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (!res.ok) {
          localStorage.removeItem('adminToken');
        }
      })
      .catch(() => {
        localStorage.removeItem('adminToken');
      });
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminDashboard />;
}

export default ProtectedAdminRoute;
