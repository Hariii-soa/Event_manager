// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/useAuth';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DashboardHome from './pages/DashboardHome';
import DashboardLayout from './components/layout/DashboardLayout';

// Route protégée
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      {/* Pages publiques */}
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Page d'accueil avec sidebar visible */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      {/* Dashboard avec sidebar */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        {/* Autres pages du dashboard */}
      </Route>

      {/* Redirection */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;