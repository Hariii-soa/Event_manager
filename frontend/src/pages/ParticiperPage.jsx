import React, { useState, useEffect } from 'react';
import InscriptionModal from '../components/modal/InscriptionModal';

const ParticiperPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  // Charger les événements disponibles
  useEffect(() => {
    fetchEvenementsDisponibles();
  }, []);

  const fetchEvenementsDisponibles = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      console.log('📋 Chargement des événements disponibles...');
      
      const response = await fetch('http://localhost:3000/api/participant/evenements-disponibles');

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des événements');
      }

      const data = await response.json();
      console.log('✅ Événements disponibles:', data);
      setEvents(data);
    } catch (error) {
      console.error('❌ Erreur:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer les événements selon la recherche
  const filteredEvents = events.filter(event =>
    event.titre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.code_evenement?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.lieu?.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Calculer le pourcentage de remplissage
  const getParticipationPercentage = (current, total) => {
    if (total === 0) return 0;
    return Math.round((current / total) * 100);
  };

  // Calculer les places restantes
  const getPlacesRestantes = (current, total) => {
    return total - current;
  };

  // Ouvrir le modal d'inscription
  const handleOpenInscriptionModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Voir les détails d'un événement
  const handleViewDetails = (eventId) => {
    window.location.href = `/dashboard/evenement-details/${eventId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              Participer aux Événements
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Découvrez et rejoignez des événements
            </p>
          </div>
        </div>
      </div>

      {/* Section principale */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <span className="material-icons text-sm">error</span>
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* En-tête avec compteur et recherche */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              Événements Disponibles
            </h2>
            <p className="text-sm text-gray-600">
              {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''} disponible{filteredEvents.length > 1 ? 's' : ''}
            </p>
          </div>
          
          {/* Barre de recherche */}
          <div className="relative w-full sm:w-auto">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base">
              search
            </span>
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full sm:w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/* Grille des événements */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <span className="material-icons animate-spin text-4xl text-blue-500">refresh</span>
              <p className="text-gray-600 text-sm sm:text-base">Chargement des événements...</p>
            </div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-icons text-6xl text-gray-300 mb-4">event_busy</span>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
              Aucun événement trouvé
            </h3>
            <p className="text-sm text-gray-500">
              {searchQuery ? 'Essayez avec d\'autres mots-clés' : 'Aucun événement disponible pour le moment'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => {
              const status = getStatusBadge(event.date_evenement);
              const participationPercent = getParticipationPercentage(
                event.nombre_participants_actuels || 0,
                event.nombre_places
              );
              const placesRestantes = getPlacesRestantes(
                event.nombre_participants_actuels || 0,
                event.nombre_places
              );

              return (
                <div
                  key={event.id_evenement}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden group flex flex-col h-full"
                >
                  {/* Image de l'événement */}
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    {event.image_url ? (
                      <img
                        src={`http://localhost:3000${event.image_url}`}
                        alt={event.titre}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <span className="material-icons text-4xl sm:text-6xl text-gray-400">event</span>
                      </div>
                    )}
                    
                    {/* Badge de statut */}
                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                      <span className={`px-2 sm:px-3 py-1 ${status.color} rounded-full text-xs font-medium backdrop-blur-sm`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Badge places restantes */}
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                      <span className="px-2 sm:px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full text-xs font-medium">
                        {placesRestantes} place{placesRestantes > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Contenu de la carte */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                      {event.titre}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">Code: {event.code_evenement}</p>
                    
                    <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Date et lieu */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                        <span className="material-icons text-sm flex-shrink-0">event</span>
                        <span className="line-clamp-1">{formatDate(event.date_evenement)}</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                        <span className="material-icons text-sm flex-shrink-0">location_on</span>
                        <span className="line-clamp-1">{event.lieu}</span>
                      </div>
                    </div>

                    {/* Barre de progression */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600 flex items-center gap-1">
                          <span className="material-icons text-sm">people</span>
                          <span className="truncate">
                            {event.nombre_participants_actuels || 0}/{event.nombre_places}
                          </span>
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

                    {/* Boutons d'action */}
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => handleViewDetails(event.id_evenement)}
                        className="flex-1 py-2 sm:py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-sm rounded-lg transition flex items-center justify-center gap-1"
                      >
                        <span className="material-icons text-sm">visibility</span>
                        <span className="hidden sm:inline">Détails</span>
                      </button>
                      <button
                        onClick={() => handleOpenInscriptionModal(event)}
                        disabled={placesRestantes === 0 || status.label === 'Terminé'}
                        className={`flex-1 py-2 sm:py-2.5 font-medium text-sm rounded-lg transition flex items-center justify-center gap-1 ${
                          placesRestantes === 0 || status.label === 'Terminé'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-pink-50 hover:bg-pink-100 text-pink-700'
                        }`}
                      >
                        <span className="material-icons text-sm">person_add</span>
                        <span className="hidden sm:inline">Partant(e)</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal d'inscription */}
      {isModalOpen && selectedEvent && (
        <InscriptionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
          onSuccess={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
            fetchEvenementsDisponibles(); // Recharger pour mettre à jour les compteurs
          }}
        />
      )}
    </div>
  );
};

export default ParticiperPage;