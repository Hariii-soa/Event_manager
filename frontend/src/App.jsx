// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import MesEvenementsPage from './pages/MesEvenementsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import ParticiperPage from './pages/ParticiperPage';
import EventDetailsPublicPage from './pages/EventDetailsPublicPage';
import Sidebar from '@/components/sidebar/Sidebar';

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

// Layout avec Sidebar pour routes protégées
const ProtectedLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar - TOUJOURS VISIBLE */}
      <Sidebar />
      
      {/* Contenu principal avec margin pour ne pas chevaucher la sidebar */}
      <div className="flex-1 lg:ml-[20vw] pt-16 lg:pt-0 bg-white">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* ===================== ROUTES PUBLIQUES - SANS SIDEBAR ===================== */}
      
      {/* Page de connexion - première page affichée */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      
      {/* Page d'inscription */}
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } 
      />

      {/* ===================== ROUTES PROTÉGÉES - AVEC SIDEBAR ===================== */}

      {/* Page d'accueil - avec carrousel + SIDEBAR */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <HomePage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      {/* Page Mes Événements - liste d'événements + SIDEBAR */}
      <Route
        path="/dashboard/mes-evenements"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <MesEvenementsPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      {/* Page Détails d'Événement + SIDEBAR */}
      <Route
        path="/dashboard/evenement/:id"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <EventDetailsPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      {/* Page Participer - liste des événements disponibles + SIDEBAR */}
      <Route
        path="/dashboard/participer"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <ParticiperPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      {/* Page Détails Événement Public (pour participants) + SIDEBAR */}
      <Route
        path="/dashboard/evenement-details/:id"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <EventDetailsPublicPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />


      {/* Redirection par défaut vers /login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;