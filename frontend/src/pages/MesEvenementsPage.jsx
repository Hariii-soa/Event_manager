// src/pages/MesEvenementsPage.jsx
import React, { useState, useEffect } from 'react';
import CreateEventModal from '../components/modal/EventCreationModal';

const MesEvenementsPage = () => {
  // Récupérer le token depuis localStorage
  const getToken = () => {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  };

  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [error, setError] = useState('');
  const token = getToken();

  // Charger les événements depuis l'API
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    if (!token) {
      console.error('Token manquant');
      setError('Vous devez être connecté pour voir vos événements');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      console.log('🔍 Chargement des événements...');
      console.log('🔑 Token:', token ? 'Présent' : 'Absent');
      
      const response = await fetch('http://localhost:3000/api/evenements/mes-evenements', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Réponse statut:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du chargement des événements');
      }

      const data = await response.json();
      console.log('✅ Événements récupérés:', data);
      setEvents(data);
    } catch (error) {
      console.error('❌ Erreur fetchEvents:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer les événements selon la recherche
  const filteredEvents = events.filter(event =>
    event.titre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.code_evenement?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fonction pour déterminer le badge de statut
  const getStatusBadge = (dateEvenement) => {
    const eventDate = new Date(dateEvenement);
    const now = new Date();
    const diffTime = eventDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: 'Terminé', color: 'bg-gray-100 text-gray-600' };
    } else if (diffDays === 0) {
      return { label: 'En cours', color: 'bg-yellow-100 text-yellow-700' };
    } else {
      return { label: 'À venir', color: 'bg-blue-100 text-blue-700' };
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  };

  // Fonction pour calculer le pourcentage de remplissage
  const getParticipationPercentage = (current, total) => {
    return Math.round((current / total) * 100);
  };

  // Fonction pour supprimer un événement
  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/evenements/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      // Recharger les événements
      fetchEvents();
      setEventToDelete(null);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    }
  };

  // Fonction pour voir les détails
  const handleViewDetails = (eventId) => {
    window.location.href = `/dashboard/evenement/${eventId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Événements</h1>
            <p className="text-gray-600">Gérez tous vos événements organisés</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-pink-100 hover:bg-pink-200 text-pink-700 font-medium rounded-xl transition"
          >
            <span className="material-icons">event</span>
            Nouvel événement
          </button>
        </div>
      </div>

      {/* Section principale */}
      <div className="px-8 py-8">
        {/* Message d'erreur si présent */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* En-tête avec compteur et recherche */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Mes Événements</h2>
            <p className="text-gray-600">
              {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''} créé{filteredEvents.length > 1 ? 's' : ''}
            </p>
          </div>
          
          {/* Barre de recherche */}
          <div className="relative">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Rechercher un événement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Grille des événements */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <span className="material-icons animate-spin text-4xl text-pink-500">refresh</span>
              <p className="text-gray-600">Chargement des événements...</p>
            </div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-icons text-6xl text-gray-300 mb-4">event_busy</span>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun événement trouvé</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? 'Essayez avec d\'autres mots-clés' : 'Commencez par créer votre premier événement'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition"
              >
                Créer un événement
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => {
              const status = getStatusBadge(event.date_evenement);
              const participationPercent = getParticipationPercentage(
                event.nombre_participants_actuels || 0,
                event.nombre_places
              );

              return (
                <div
                  key={event.id_evenement}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden group"
                >
                  {/* Image de l'événement */}
                  <div className="relative h-48 overflow-hidden">
                    {event.image_url ? (
                      <img
                        src={`http://localhost:3000${event.image_url}`}
                        alt={event.titre}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-pink-100 to-blue-100 flex items-center justify-center">
                        <span className="material-icons text-6xl text-gray-400">event</span>
                      </div>
                    )}
                    
                    {/* Badge de statut */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 ${status.color} rounded-full text-xs font-medium backdrop-blur-sm`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Actions (éditer et supprimer) */}
                    {status.label === 'En cours' && (
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => setEventToDelete(event.id_evenement)}
                          className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition"
                        >
                          <span className="material-icons text-red-600 text-sm">delete</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Contenu de la carte */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                      {event.titre}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">Code: {event.code_evenement}</p>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Date et lieu */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="material-icons text-base">event</span>
                        <span className="line-clamp-1">{formatDate(event.date_evenement)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="material-icons text-base">location_on</span>
                        <span className="line-clamp-1">{event.lieu}</span>
                      </div>
                    </div>

                    {/* Barre de progression des participants */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600 flex items-center gap-1">
                          <span className="material-icons text-sm">people</span>
                          {event.nombre_participants_actuels || 0}/{event.nombre_places} participants
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            participationPercent >= 90 ? 'bg-red-500' :
                            participationPercent >= 70 ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`}
                          style={{ width: `${participationPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Bouton voir les détails */}
                    <button
                      onClick={() => handleViewDetails(event.id_evenement)}
                      className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <span className="material-icons text-sm">visibility</span>
                      Voir les détails
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de création d'événement */}
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEventCreated={() => {
          setIsModalOpen(false);
          fetchEvents(); // Recharger la liste
        }}
      />

      {/* Modal de confirmation de suppression */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 m-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <span className="material-icons text-red-600">warning</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Supprimer l&apos;événement</h3>
                <p className="text-sm text-gray-600">
                  Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEventToDelete(null)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteEvent(eventToDelete)}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MesEvenementsPage;