// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import MesEvenementsPage from './pages/MesEvenementsPage';
import EventDetailsPage from './pages/EventDetailsPage';

// Route protégée
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

// Route publique
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <Routes>
      {/* Pages publiques */}
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />

      {/* Page d'accueil - avec le carrousel (Image 2) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      {/* Page Mes Événements - accessible via bouton "Organiser" dans sidebar */}
      <Route
        path="/dashboard/mes-evenements"
        element={
          <ProtectedRoute>
            <MesEvenementsPage />
          </ProtectedRoute>
        }
      />

      {/* Page de détails d'événement */}
      <Route
        path="/dashboard/evenement/:id"
        element={
          <ProtectedRoute>
            <EventDetailsPage />
          </ProtectedRoute>
        }
      />

      {/* Redirection par défaut */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;