// src/pages/GoogleAuthSuccess.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleAuth = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userStr = urlParams.get('user');

        if (token && userStr) {
          const user = JSON.parse(decodeURIComponent(userStr));
          
          // Stocker les données
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          console.log('✅ Authentification Google réussie:', user.email);
          
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
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
        <p className="text-gray-600">Connexion en cours...</p>
      </div>
    </div>
  );
};

export default GoogleAuthSuccess;