// src/components/auth/AuthLayout.jsx
import React from 'react';



const AuthLayout = ({ children, sideContent }) => {
  return (
    <div className="flex min-h-screen">
      {/* CADRE GAUCHE - BLANC */}
      <div className="flex flex-col justify-center w-1/2 p-12 bg-white">
        <div className="w-full max-w-md mx-auto">
          {/* Logo PNG */}
          <div className="mb-8">
            <img src="logo.png" alt="Evenia" className="h-24" />
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