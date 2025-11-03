// src/components/layout/DashboardLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;