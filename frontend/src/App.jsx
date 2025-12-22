import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import GoogleAuthSuccess from './pages/GoogleAuthSuccess';
import HomePage from './pages/HomePage';
import MesEvenementsPage from './pages/MesEvenementsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import ParticiperPage from './pages/ParticiperPage';
import EventDetailsPublicPage from './pages/EventDetailsPublicPage';
import ActivitesPage from './pages/ActivitesPage';
import ConsulterPage from './pages/ConsulterPage';
import NotificationsPage from './pages/NotificationsPage';
import Sidebar from '@/components/sidebar/Sidebar';
import TopBar from '@/components/layout/TopBar';
import LandingPage from './pages/LandingPage';

// Route protégée - redirige vers /welcome si pas connecté
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/welcome" replace />;
};

// Route publique - redirige vers /dashboard si connecté
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
};

// Layout avec Sidebar ET TopBar pour routes protégées
const ProtectedLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 lg:ml-[20vw] bg-white">
        <TopBar />
        <div className="pt-16 sm:pt-20">
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* ===================== LANDING PAGE - ROUTE PRINCIPALE ===================== */}
      
      {/* Landing Page - Page d'accueil publique */}
      <Route 
        path="/" 
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/welcome" 
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        } 
      />
      
      {/* ===================== ROUTES PUBLIQUES - AUTHENTIFICATION ===================== */}
      
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } 
      />

      <Route 
        path="/forgot-password" 
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        } 
      />

      <Route 
        path="/reset-password/:token" 
        element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        } 
      />

      <Route 
        path="/auth/google/success" 
        element={<GoogleAuthSuccess />} 
      />

      {/* ===================== ROUTES PROTÉGÉES - DASHBOARD ===================== */}

      {/* Dashboard Home - après connexion */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <HomePage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

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

      <Route
        path="/dashboard/activites"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <ActivitesPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard/consulter"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <ConsulterPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/notifications"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <NotificationsPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      {/* Redirection par défaut vers landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;