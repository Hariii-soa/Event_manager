// src/components/modal/ConfirmModal.jsx
import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-sm p-6 bg-white shadow-xl rounded-xl">
        <h3 className="mb-3 text-lg font-bold text-gray-800">{title}</h3>
        <p className="mb-6 text-gray-600">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-pink-500 rounded-lg hover:bg-pink-600"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;