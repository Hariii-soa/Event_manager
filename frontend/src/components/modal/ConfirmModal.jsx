// src/components/modal/ConfirmModal.jsx
import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isLoading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 m-4 bg-white shadow-2xl rounded-2xl">
        {/* Icône et titre */}
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <span className="material-icons text-red-600">warning</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-white bg-red-500 rounded-lg hover:bg-red-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="material-icons animate-spin text-sm">refresh</span>
                Déconnexion...
              </>
            ) : (
              'Déconnexion'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;