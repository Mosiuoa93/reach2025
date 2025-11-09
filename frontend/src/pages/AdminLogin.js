import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    // Set admin token and redirect to dashboard
    localStorage.setItem('adminToken', 'admin-access-token');
    navigate('/admin');
  }, [navigate]);

  return null;
}

export default AdminLogin;
