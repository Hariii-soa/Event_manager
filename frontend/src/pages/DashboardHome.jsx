// src/pages/DashboardHome.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';

const DashboardHome = () => {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Mes Événements</h1>
        <p className="text-sm text-gray-600">Gérez tous vos événements organisés, {user?.name || 'Utilisateur'} !</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">7 événements créés</p>
        <Link
          to="/dashboard/create"
          className="px-4 py-2 text-sm text-white transition bg-pink-500 rounded-lg hover:bg-pink-600"
        >
          Nouveau événement
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Exemple de carte */}
        <EventCard
          status="En cours"
          title="Atelier Design UX/UI"
          code="EVT002"
          date="samedi 30 novembre 2024"
          location="Studio Créatif, Lyon"
          participants="25/30"
          image="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400"
        />
        {/* Ajouter d'autres cartes ici */}
      </div>
    </div>
  );
};

// Composant réutilisable
const EventCard = ({ status, title, code, date, location, participants, image }) => {
  const statusColor = status === 'En cours' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800';

  return (
    <div className="overflow-hidden transition bg-white shadow-md rounded-2xl hover:shadow-lg">
      <img src={image} alt={title} className="object-cover w-full h-40" />
      <div className="p-4">
        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 ${statusColor}`}>
          {status}
        </span>
        <h3 className="mb-1 font-semibold text-gray-800">{title}</h3>
        <p className="mb-2 text-xs text-gray-500">Code: {code}</p>
        <p className="mb-1 text-xs text-gray-600">{date}</p>
        <p className="mb-3 text-xs text-gray-500">{location}</p>
        <div className="flex items-center justify-between">
          <div className="flex-1 h-2 mr-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-pink-500 rounded-full"
              style={{ width: participants.split('/')[0] / participants.split('/')[1] * 100 + '%' }}
            ></div>
          </div>
          <span className="text-xs text-gray-600">{participants} participants</span>
        </div>
        <button className="w-full px-3 py-2 mt-3 text-sm text-blue-700 transition bg-blue-100 rounded-lg hover:bg-blue-200">
          Voir les détails
        </button>
      </div>
    </div>
  );
};

export default DashboardHome;