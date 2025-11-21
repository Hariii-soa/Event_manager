import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InscriptionModal from '../components/modal/InscriptionModal';

const EventDetailsPublicPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Charger les détails de l'événement
  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:3000/api/participant/evenements-disponibles`);

      if (!response.ok) {
        throw new Error('Erreur lors du chargement de l\'événement');
      }

      const data = await response.json();
      const foundEvent = data.find(e => e.id_evenement === parseInt(id));
      
      if (!foundEvent) {
        throw new Error('Événement non trouvé');
      }

      setEvent(foundEvent);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('fr-FR', options);
  };

  // Calculer le statut
  const getStatus = () => {
    if (!event) return { label: '', color: '' };
    
    const eventDate = new Date(event.date_evenement);
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

  // Calculer la participation
  const getParticipationPercentage = () => {
    if (!event) return 0;
    const current = event.nombre_participants_actuels || 0;
    return Math.round((current / event.nombre_places) * 100);
  };

  const getParticipationColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="material-icons animate-spin text-4xl text-blue-500">refresh</span>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <span className="material-icons text-6xl text-red-500 mb-4">error</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">{error || 'Événement non trouvé'}</p>
          <button
            onClick={() => navigate('/dashboard/participer')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
          >
            Retour aux événements
          </button>
        </div>
      </div>
    );
  }

  const status = getStatus();
  const participationPercentage = getParticipationPercentage();
  const placesRestantes = event.nombre_places - (event.nombre_participants_actuels || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec image de couverture */}
      <div className="relative h-64 sm:h-80 md:h-96 bg-gradient-to-br from-blue-100 to-purple-100">
        {event.image_url ? (
          <img
            src={`http://localhost:3000${event.image_url}`}
            alt={event.titre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-icons text-6xl sm:text-9xl text-gray-400">event</span>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        {/* Bouton retour */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
          <button
            onClick={() => navigate('/dashboard/participer')}
            className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white rounded-lg transition text-sm"
          >
            <span className="material-icons text-sm">arrow_back</span>
            <span className="hidden sm:inline font-medium">Retour</span>
          </button>
        </div>

        {/* Bouton inscription */}
        {status.label !== 'Terminé' && placesRestantes > 0 && (
          <div className="absolute top-4 sm:top-6 right-4 sm:right-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition shadow-lg font-medium text-sm"
            >
              <span className="material-icons text-sm">person_add</span>
              <span className="hidden sm:inline">Je suis partant(e) !</span>
              <span className="sm:hidden">OK</span>
            </button>
          </div>
        )}

        {/* Titre et code */}
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
            <span className={`px-3 py-1 ${status.color} rounded-full text-xs font-medium backdrop-blur-sm`}>
              {status.label}
            </span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
              {placesRestantes} place{placesRestantes > 1 ? 's' : ''}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 line-clamp-2">{event.titre}</h1>
          <p className="text-sm sm:text-base opacity-90">Code: {event.code_evenement}</p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Colonne principale - Description */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {event.description || 'Aucune description disponible.'}
              </p>
            </div>

            {/* Section Participation */}
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 mt-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Participation</h2>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <span className="text-base sm:text-lg font-medium text-gray-700 mb-2 sm:mb-0">
                  Participants inscrits
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {event.nombre_participants_actuels || 0}/{event.nombre_places}
                </span>
              </div>

              {/* Barre de progression */}
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full ${getParticipationColor(participationPercentage)} transition-all`}
                  style={{ width: `${participationPercentage}%` }}
                ></div>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                {participationPercentage}% de places occupées
              </p>
              
              {placesRestantes > 0 ? (
                <p className="text-sm text-green-600 font-medium">
                  ✓ {placesRestantes} place{placesRestantes > 1 ? 's' : ''} encore disponible{placesRestantes > 1 ? 's' : ''}
                </p>
              ) : (
                <p className="text-sm text-red-600 font-medium">
                  ✗ Événement complet
                </p>
              )}

              {/* Bouton d'inscription */}
              {status.label !== 'Terminé' && placesRestantes > 0 && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full mt-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition font-medium flex items-center justify-center gap-2 text-sm"
                >
                  <span className="material-icons">person_add</span>
                  S'inscrire à cet événement
                </button>
              )}
            </div>
          </div>

          {/* Colonne latérale - Informations */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 sticky top-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">Informations</h2>

              <div className="space-y-6">
                {/* Date */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="material-icons text-blue-600 text-sm">event</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">Date et heure</p>
                    <p className="font-medium text-gray-900 text-sm break-words">
                      {formatDate(event.date_evenement)}
                    </p>
                  </div>
                </div>

                {/* Lieu */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="material-icons text-purple-600 text-sm">location_on</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">Lieu de l'événement</p>
                    <p className="font-medium text-gray-900 text-sm break-words">{event.lieu}</p>
                  </div>
                </div>

                {/* Capacité */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="material-icons text-green-600 text-sm">people</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">Capacité maximale</p>
                    <p className="font-medium text-gray-900 text-sm">{event.nombre_places} places</p>
                  </div>
                </div>

                {/* Statut */}
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 ${status.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <span className="material-icons text-sm">schedule</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">Statut actuel</p>
                    <p className="font-medium text-gray-900 text-sm">{status.label}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'inscription */}
      {isModalOpen && (
        <InscriptionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={event}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchEventDetails(); // Recharger pour mettre à jour les compteurs
          }}
        />
      )}
    </div>
  );
};

export default EventDetailsPublicPage;