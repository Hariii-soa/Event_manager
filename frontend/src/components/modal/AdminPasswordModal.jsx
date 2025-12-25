import React, { useState } from 'react';

const AdminPasswordModal = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const getToken = () => {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.error('Erreur récupération token:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!password) {
        setError('Veuillez entrer le mot de passe administrateur');
        setIsLoading(false);
        return;
      }

      const token = getToken();
      if (!token) {
        setError('Session expirée. Veuillez vous reconnecter.');
        setIsLoading(false);
        return;
      }

      console.log('🔐 Vérification mot de passe admin...');

      const response = await fetch('http://localhost:3000/api/admin/verify-admin-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adminPassword: password })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Mot de passe administrateur incorrect');
      }

      console.log('✅ Authentification admin réussie');
      
      if (onSuccess) {
        onSuccess();
      }
      
      setPassword('');
    } catch (err) {
      console.error('❌ Erreur authentification admin:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setPassword('');
    setError('');
    if (onClose) {
      onClose();
    }
    window.location.href = '/';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
        <div style={{ backgroundColor: '#F4CFDF' }} className="px-6 py-5 flex items-center gap-4">
          <div className="w-14 h-14 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <span className="material-icons text-gray-800 text-3xl">admin_panel_settings</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Accès Administrateur</h2>
            <p className="text-sm text-gray-700">Authentification requise</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="material-icons text-blue-500 text-xl">info</span>
              <div>
                <p className="text-sm text-blue-800 font-medium mb-1">
                  Section réservée aux administrateurs
                </p>
                <p className="text-xs text-blue-700">
                  Veuillez entrer le mot de passe administrateur pour accéder à la gestion des activités.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <span className="material-icons text-sm">error</span>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="material-icons text-base text-gray-600">lock</span>
              Mot de passe administrateur
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    handleSubmit(e);
                  }
                }}
                placeholder="Entrez le mot de passe admin"
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-200 focus:border-pink-400 outline-none transition text-sm"
                disabled={isLoading}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                disabled={isLoading}
              >
                <span className="material-icons text-xl">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <span className="material-icons text-xs">info</span>
              Par défaut: Admin123@
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-linear-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="material-icons animate-spin text-sm">refresh</span>
                  Vérification...
                </>
              ) : (
                <>
                  <span className="material-icons text-sm">login</span>
                  Accéder
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center flex items-center justify-center gap-1">
            <span className="material-icons text-xs">security</span>
            Accès sécurisé réservé aux administrateurs uniquement
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPasswordModal;