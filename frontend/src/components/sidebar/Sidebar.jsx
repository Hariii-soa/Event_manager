// src/components/sidebar/Sidebar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateEventModal from '../modal/EventCreationModal';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogoutConfirm = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Bouton Menu Mobile */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2.5 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition"
      >
        <span className="material-icons text-gray-800 text-2xl">
          {isMobileMenuOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Overlay Mobile */}
      {isMobileMenuOpen && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-[280px] sm:w-[300px] lg:w-[20vw] bg-white border-r border-gray-200 flex flex-col z-40 transform transition-transform duration-300 ease-in-out lg:transform-none ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo et titre */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-purple-100 rounded-full flex items-center justify-center">
              <img src="/logo.png" alt="Evenia" className="w-14 h-14 sm:w-20 sm:h-20" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Evenia</h1>
              <p className="text-sm sm:text-base text-gray-500">Gestion d&apos;événements</p>
            </div>
          </div>
        </div>

        {/* Section: Choisissez votre rôle et action */}
        <div className="p-4 overflow-y-auto flex-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Choisissez votre rôle et action
          </p>

          {/* Pour les organisateurs */}
          <div className="mb-4">
            <p className="text-xs text-gray-600 mb-2">Créez et gérez vos événements</p>
            
            {/* Bouton Organiser - Redirige vers /dashboard/mes-evenements */}
            <button
              onClick={() => {
                navigate('/dashboard/mes-evenements');
                closeMobileMenu();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-pink-50 hover:bg-pink-100 rounded-xl transition mb-2 group"
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                <span className="material-icons text-pink-600 text-lg">event</span>
              </div>
              <span className="font-medium text-gray-800 flex-1 text-left">Organiser</span>
              <span className="text-xs bg-pink-200 text-pink-800 px-2 py-0.5 rounded-full font-medium">
                Org.
              </span>
            </button>
            
            {/* Bouton Activités */}
            <button
              onClick={() => {
                navigate('/dashboard/activites');
                closeMobileMenu();
              }}
              className="w-full flex items-center gap-3 px-3 sm:px-4 py-3 bg-yellow-50 hover:bg-yellow-100 rounded-xl transition"
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="material-icons text-yellow-600 text-lg">bolt</span>
              </div>
              <span className="font-medium text-sm sm:text-base text-gray-800 flex-1 text-left">Activités</span>
              <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full font-medium">
                Org.
              </span>
            </button>
          </div>

          {/* Pour les participants */}
          <div>
            <p className="text-xs text-gray-600 mb-2">Rejoignez et consultez vos événements</p>
            
            <button
              onClick={() => {
                navigate('/dashboard/participer');
                closeMobileMenu();
              }}
              className="w-full flex items-center gap-3 px-3 sm:px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition mb-2"
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="material-icons text-blue-600 text-lg">group</span>
              </div>
              <span className="font-medium text-sm sm:text-base text-gray-800 flex-1 text-left">Participer</span>
              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                Part.
              </span>
            </button>

            <button
              onClick={() => {
                navigate('/dashboard/consulter');
                closeMobileMenu();
              }}
              className="w-full flex items-center gap-3 px-3 sm:px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition"
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="material-icons text-purple-600 text-lg">description</span>
              </div>
              <span className="font-medium text-sm sm:text-base text-gray-800 flex-1 text-left">Consulter</span>
              <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full font-medium">
                Part.
              </span>
            </button>
          </div>
        </div>

        <div className="flex-1"></div>

        {/* Bouton déconnexion */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              setIsLogoutModalOpen(true);
              closeMobileMenu();
            }}
            className="w-full flex items-center gap-3 px-3 sm:px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition"
          >
            <span className="material-icons text-lg">logout</span>
            <span className="font-medium text-sm sm:text-base">Se déconnecter</span>
          </button>
        </div>
      </div>

      {/* Modal de création d'événement */}
      <CreateEventModal 
        isOpen={isEventModalOpen} 
        onClose={() => setIsEventModalOpen(false)}
        onEventCreated={() => {
          setIsEventModalOpen(false);
          navigate('/dashboard/mes-evenements');
        }}
      />

      {/* Modal de confirmation de déconnexion */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 m-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="material-icons text-red-600">warning</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmer la déconnexion</h3>
                <p className="text-sm text-gray-600">
                  Êtes-vous sûr de vouloir vous déconnecter ?
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;