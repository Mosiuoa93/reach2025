import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ChoicePage from './pages/ChoicePage';
import IndividualRegistration from './pages/IndividualRegistration';
import GroupRegistration from './pages/GroupRegistration';
import ConfirmationPage from './pages/ConfirmationPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Footer from './components/Footer';

function ProtectedAdminRoute() {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    window.location.href = '/admin/login';
    return null;
  }
  return <AdminDashboard />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<ChoicePage />} />
        <Route path="/register/individual" element={<IndividualRegistration />} />
        <Route path="/register/group" element={<GroupRegistration />} />
        <Route path="/register/confirmation" element={<ConfirmationPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedAdminRoute />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
