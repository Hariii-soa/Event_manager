// src/components/layout/DashboardLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/sidebar/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar - TOUJOURS VISIBLE */}
      <Sidebar />

      {/* Contenu principal avec margin pour ne pas chevaucher la sidebar */}
      <div className="flex-1 lg:ml-[20vw] pt-16 lg:pt-0 bg-white">
        {/* Les sous-routes s'affichent ici */}
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;