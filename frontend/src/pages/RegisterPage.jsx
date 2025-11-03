// src/pages/RegisterPage.jsx
import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import AuthForm from '../components/auth/AuthForm';
//import auth.png from '../'; // Mets ton image ici

const RegisterPage = () => {
  return (
    <AuthLayout
      sideContent={
  <>
    <img
      src="./auth.png"
      alt="Organisation d'événements"
      className="w-full max-w-lg mb-6 shadow-lg rounded-xl"
    />
    <h2 className="mb-3 text-2xl font-bold text-gray-800">
      Organisez vos événements en toute simplicité
    </h2>
    <p className="text-sm leading-relaxed text-gray-600">
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