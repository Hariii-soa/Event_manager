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
import TopBar from '@/components/layout/TopBar'; // ✅ NOUVEAU

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

// Layout avec Sidebar ET TopBar pour routes protégées
const ProtectedLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar - TOUJOURS VISIBLE */}
      <Sidebar />
      
      {/* Contenu principal avec TopBar */}
      <div className="flex-1 lg:ml-[20vw] bg-white">
        {/* TopBar fixée en haut avec notifications */}
        <TopBar />
        
        {/* Contenu avec padding-top pour compenser la TopBar fixe */}
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
      {/* ===================== ROUTES PUBLIQUES - SANS SIDEBAR/TOPBAR ===================== */}
      
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

      {/* ===================== ROUTES PROTÉGÉES - AVEC SIDEBAR + TOPBAR ===================== */}

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

      {/* Redirection par défaut vers /login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;