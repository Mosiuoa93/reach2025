import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect directly to admin dashboard
    navigate('/admin');
  }, [navigate]);

  return null;
}

export default AdminLogin;
