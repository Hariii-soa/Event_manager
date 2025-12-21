// src/pages/GoogleAuthSuccess.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleGoogleAuth = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userStr = urlParams.get('user');

        console.log('🔍 Traitement auth Google...');
        console.log('🎫 Token:', token ? 'Présent' : 'Absent');
        console.log('👤 User:', userStr ? 'Présent' : 'Absent');

        if (token && userStr) {
          const user = JSON.parse(decodeURIComponent(userStr));
          
          console.log('✅ Données utilisateur:', user);
          
          // Utiliser la fonction login du contexte d'authentification
          login(user, token);
          
          console.log('✅ Authentification Google réussie, redirection vers /');
          
          // Rediriger vers la page d'accueil
          navigate('/', { replace: true });
        } else {
          console.error('❌ Token ou user manquant');
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('❌ Erreur traitement auth Google:', error);
        navigate('/login', { replace: true });
      }
    };

    handleGoogleAuth();
  }, [navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Connexion en cours...</p>
        <p className="text-gray-500 text-sm mt-2">Vous allez être redirigé vers la page d'accueil</p>
      </div>
    </div>
  );
};

export default GoogleAuthSuccess;