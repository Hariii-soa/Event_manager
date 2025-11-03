// src/components/sidebar/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/useAuth.js';
import ConfirmModal from '../modal/ConfirmModal';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  
  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const handleConfirmLogout = () => {
    setShowModal(false);
    logout();
  };

  return (
    <>
      <aside className="fixed left-0 top-0 w-64 h-screen bg-white shadow-xl overflow-y-auto z-50">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-10">
            <img src="/logo.png" alt="Evenia" className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Evenia</h1>
              <p className="text-xs text-gray-500">Gestion d'événements</p>
            </div>
          </div>

          <nav className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Choisissez votre rôle et action
            </p>

            <div className="space-y-2">
              <p className="text-xs text-gray-600 mb-2">Pour les organisateurs</p>
              
              <Link
                to="/dashboard"
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition ${
                  isActive('/dashboard') && location.pathname === '/dashboard' 
                    ? 'bg-pink-100 text-pink-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <span className="text-lg">📅</span>
                  <span className="text-base">Organiser</span>
                </span>
                <span className="text-xs px-2 py-1 bg-pink-100 text-pink-600 rounded-full">Org.</span>
              </Link>

              <Link
                to="/dashboard/activities"
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition ${
                  isActive('/dashboard/activities') 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <span className="text-lg">⚡</span>
                  <span className="text-base">Activités</span>
                </span>
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Org.</span>
              </Link>
            </div>

            <div className="space-y-2 mt-6">
              <p className="text-xs text-gray-600 mb-2">Pour les participants</p>
              
              <Link
                to="/events"
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition ${
                  isActive('/events') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <span className="text-lg">👥</span>
                  <span className="text-base">Participer</span>
                </span>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Part.</span>
              </Link>

              <Link
                to="/browse"
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition ${
                  isActive('/browse') 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center space-x-3">
                 <span className="text-lg">📋</span>
                  <span className="text-base">Consulter</span>
                </span>
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">Part.</span>
              </Link>
            </div>
          </nav>
        </div>

        <div className="p-6 border-t">
          <button 
            onClick={handleLogoutClick}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center transition"
          >
            ← Se déconnecter
          </button>
        </div>
      </aside>

      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmLogout}
        title="Confirmation de déconnexion"
        message="Êtes-vous sûr de vouloir vous déconnecter ?"
      />
    </>
  );
};

export default Sidebar;