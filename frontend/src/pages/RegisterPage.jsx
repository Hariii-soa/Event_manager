// src/pages/RegisterPage.jsx
import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import AuthForm from '../components/auth/AuthForm';

const RegisterPage = () => {
  return (
    <AuthLayout
      sideContent={
        <>
          <img
            src="./auth.png"
            alt="Organisation d'événements"
            className="w-full max-w-xs sm:max-w-sm md:max-w-lg mb-4 sm:mb-6 shadow-lg rounded-xl mx-auto"
          />
          <h2 className="mb-2 sm:mb-3 text-xl sm:text-2xl font-bold text-gray-800 px-4">
            Organisez vos événements en toute simplicité
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-gray-600 px-4">
            Evenia vous accompagne dans la gestion complète de vos événements,
            de la planification à l'exécution, avec des outils intuitifs et puissants.
          </p>
        </>
      }
    >
      <AuthForm type="register" />
    </AuthLayout>
  );
};

export default RegisterPage;