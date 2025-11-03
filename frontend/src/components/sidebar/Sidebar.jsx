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

  const handleLogoutClick = () => setShowModal(true);
  const handleConfirmLogout = () => {
    setShowModal(false);
    logout();
  };

  return (
    <>
      <aside className="fixed left-0 top-0 w-[20vw] h-screen bg-white shadow-xl overflow-y-auto z-50">
        <div className="p-8">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-12">
            
            <img src="/logo.png" alt="Evenia" className="w-55 h-30" />
          </div>

          <nav className="space-y-6">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Choisissez votre rôle et action
            </p>

            {/* === ORGANISATEURS === */}
            <div className="space-y-3">
              <p className="text-xs text-gray-600 font-medium">
                Créer et gérez vos événements
              </p>

              {/* ORGANISER - VERT PÂLE */}
              <Link
                to="/dashboard"
                className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${
                  isActive('/dashboard') && location.pathname === '/dashboard'
                    ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                    : 'bg-emerald-50 text-gray-700 hover:bg-emerald-50'
                }`}
              >
                <span className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <span className="text-lg">📅</span>
                  </div>
                  <span className="font-medium">Organiser</span>
                </span>
                <span className="text-xs px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                  Org.
                </span>
              </Link>

              {/* ACTIVITÉS - SAUMON */}
              <Link
                to="/dashboard/activities"
                className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${
                  isActive('/dashboard/activities')
                    ? 'bg-orange-100 text-orange-700 shadow-sm'
                    : 'bg-orange-50 text-gray-700 hover:bg-orange-50'
                }`}
              >
                <span className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <span className="text-lg">⚡</span>
                  </div>
                  <span className="font-medium">Activités</span>
                </span>
                <span className="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                  Org.
                </span>
              </Link>
            </div>

            {/* === PARTICIPANTS === */}
            <div className="space-y-3">
              <p className="text-xs text-gray-600 font-medium">
                Rejoignez et consultez vos événements
              </p>

              {/* PARTICIPER - BLEU CIEL */}
              <Link
                to="/events"
                className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${
                  isActive('/events')
                    ? 'bg-sky-100 text-sky-700 shadow-sm'
                    : 'bg-sky-50 text-gray-700 hover:bg-sky-50'
                }`}
              >
                <span className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
                    <span className="text-lg">👥</span>
                  </div>
                  <span className="font-medium">Participer</span>
                </span>
                <span className="text-xs px-3 py-1 bg-sky-100 text-sky-700 rounded-full font-medium">
                  Part.
                </span>
              </Link>

              {/* CONSULTER - ROSE POUDRÉ */}
              <Link
                to="/browse"
                className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${
                  isActive('/browse')
                    ? 'bg-rose-100 text-rose-700 shadow-sm'
                    : 'bg-rose-50 text-gray-700 hover:bg-rose-50'
                }`}
              >
                <span className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                    <span className="text-lg">📋</span>
                  </div>
                  <span className="font-medium">Consulter</span>
                </span>
                <span className="text-xs px-3 py-1 bg-rose-100 text-rose-700 rounded-full font-medium">
                  Part.
                </span>
              </Link>
            </div>
          </nav>
        </div>

        {/* BOUTON DÉCONNEXION PLUS BAS */}
        <div className="mt-auto p-8 pt-16 border-t border-gray-100">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition"
          >
            <span>←</span>
            <span>Se déconnecter</span>
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