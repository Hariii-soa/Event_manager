import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import AuthForm from '../components/auth/AuthForm';

const LoginPage = () => {
  return (
    <AuthLayout
      sideContent={
        <div className="flex flex-col items-center justify-center p-8">
          <img
            src="./auth.png"
                alt="Organisation d'événements"
                className="w-full max-w-lg mb-6 shadow-lg rounded-xl"
          />
          <h2 className="mb-2 text-2xl font-bold text-gray-800">Organisez vos événements en toute simplicité</h2>
          <p className="text-center text-gray-600">
            Evenia vous accompagne dans la gestion complète de vos événements,
            de la planification à l'exécution, avec des outils intuitifs et puissants.
          </p>
        </div>
      }
    >
      <AuthForm type="login" />
    </AuthLayout>
  );
};

export default LoginPage;