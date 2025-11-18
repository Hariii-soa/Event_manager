// src/components/auth/AuthLayout.jsx
import React from 'react';

const AuthLayout = ({ children, sideContent }) => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* CADRE GAUCHE - BLANC */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 p-6 sm:p-8 md:p-12 bg-white">
        <div className="w-full max-w-md mx-auto">
          {/* Logo PNG */}
          <div className="flex items-center space-x-3 mb-8 sm:mb-12">
            <img src="/logo.png" alt="Evenia" className="w-16 h-16 sm:w-20 sm:h-20" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Evenia</h1>
              <p className="text-base sm:text-lg text-gray-500">Gestion d'événements</p>
            </div>
          </div>
          {children}
        </div>
      </div>

      {/* CADRE DROIT - VERT PÂLE - Caché sur mobile, visible sur desktop */}
      <div className="hidden lg:flex w-full lg:w-1/2 bg-[#ECFCCB] items-center justify-center p-8 md:p-12">
        <div className="max-w-lg text-center">
          {sideContent}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;