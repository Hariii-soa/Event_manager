// src/components/auth/AuthLayout.jsx
import React from 'react';



const AuthLayout = ({ children, sideContent }) => {
  return (
    <div className="flex min-h-screen">
      {/* CADRE GAUCHE - BLANC */}
      <div className="flex flex-col justify-center w-1/2 p-12 bg-white">
        <div className="w-full max-w-md mx-auto">
          {/* Logo PNG */}
          <div className="flex items-center space-x-3 mb-12">
            <img src="/logo.png" alt="Evenia" className="w-20 h-20" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Evenia</h1>
              <p className="text-lg text-gray-500">Gestion d'événements</p>
            </div>
          </div>
          {children}
        </div>
      </div>

      {/* CADRE DROIT - VERT PÂLE */}
      <div className="w-1/2 bg-[#ECFCCB] flex items-center justify-center p-12">
        <div className="max-w-lg text-center">
          {sideContent}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;