// src/components/layout/DashboardLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import EventCreationModal from '../modal/EventCreationModal';

const DashboardLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Layout principal */}
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar openModal={() => setIsModalOpen(true)} />
        <div className="flex-1 p-6 md:p-8 md:ml-[20vw]">
          <Outlet />
        </div>
      </div>

      {/* MODAL EN DEHORS DU LAYOUT → Z-INDEX ÉLEVÉ */}
      <EventCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default DashboardLayout;