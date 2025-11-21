
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CreateEventModal from '@/components/modal/EventCreationModal';

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const ADMIN_EMAIL = 'harisoamarina21@gmail.com';

  // Récupérer le token
  const getToken = () => {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.error('Erreur token:', error);
      return null;
    }
  };

  // Vérifier si l'utilisateur est admin
  const checkAdmin = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setIsAdmin(user.email === ADMIN_EMAIL);
      }
    } catch (error) {
      console.error('Erreur vérification admin:', error);
    }
  };

  // Charger les détails de l'événement
  useEffect(() => {
    checkAdmin();
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    const token = getToken();
    if (!token) {
      setError('Vous devez être connecté');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:3000/api/evenements/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement de l\'événement');
      }

      const data = await response.json();
      setEvent(data);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer l'événement
  const handleDelete = async () => {
    const token = getToken();
    try {
      const response = await fetch(`http://localhost:3000/api/evenements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      navigate('/dashboard/mes-evenements');
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
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
      minute: '2-digit',
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
      <div className="w-full bg-gray-50 flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <span className="material-icons animate-spin text-4xl text-pink-500">refresh</span>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="w-full bg-gray-50 flex items-center justify-center py-20">
        <div className="text-center">
          <span className="material-icons text-6xl text-red-500 mb-4">error</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-4">{error || 'Événement non trouvé'}</p>
          <button
            onClick={() => navigate('/dashboard/mes-evenements')}
            className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  const status = getStatus();
  const participationPercentage = getParticipationPercentage();
  const placesRestantes = event.nombre_places - (event.nombre_participants_actuels || 0);

  return (
    <div className="w-full bg-gray-50">
      {/* Header avec image de couverture */}
      <div className="relative h-80 sm:h-96 bg-gradient-to-br from-pink-100 to-blue-100">
        {event.image_url ? (
          <img
            src={`http://localhost:3000${event.image_url}`}
            alt={event.titre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-icons text-9xl text-gray-400">event</span>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        {/* Boutons d'action */}
        <div className="absolute top-6 left-6">
          <button
            onClick={() => navigate('/dashboard/mes-evenements')}
            className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white rounded-lg transition"
          >
            <span className="material-icons">arrow_back</span>
            <span className="font-medium">Retour</span>
          </button>
        </div>

        {isAdmin && (
          <div className="absolute top-6 right-6 flex gap-3">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition shadow-lg"
            >
              <span className="material-icons text-blue-600">edit</span>
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition shadow-lg"
            >
              <span className="material-icons text-red-600">delete</span>
            </button>
          </div>
        )}

        {/* Titre et code */}
        <div className="absolute bottom-6 left-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 ${status.color} rounded-full text-xs font-medium backdrop-blur-sm`}>
              {status.label}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{event.titre}</h1>
          <p className="text-lg opacity-90">Code: {event.code_evenement}</p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale - Description */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {event.description || 'Aucune description disponible.'}
              </p>
            </div>

            {/* Section Participation */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Participation</h2>

              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium text-gray-700">Participants inscrits</span>
                <span className="text-2xl font-bold text-gray-900">
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

              <p className="text-sm text-gray-600">{participationPercentage}% de places occupées</p>

              {placesRestantes > 0 ? (
                <p className="text-sm text-green-600 font-medium mt-2">
                  ✓ {placesRestantes} place{placesRestantes > 1 ? 's' : ''} encore disponible
                  {placesRestantes > 1 ? 's' : ''}
                </p>
              ) : (
                <p className="text-sm text-red-600 font-medium mt-2">✗ Événement complet</p>
              )}
            </div>
          </div>

          {/* Colonne latérale - Informations */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Informations</h2>

              <div className="space-y-6">
                {/* Date */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="material-icons text-pink-600">event</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date et heure</p>
                    <p className="font-medium text-gray-900">{formatDate(event.date_evenement)}</p>
                  </div>
                </div>

                {/* Lieu */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="material-icons text-blue-600">location_on</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Lieu de l'événement</p>
                    <p className="font-medium text-gray-900">{event.lieu}</p>
                  </div>
                </div>

                {/* Capacité */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="material-icons text-purple-600">people</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Capacité maximale</p>
                    <p className="font-medium text-gray-900">{event.nombre_places} places</p>
                  </div>
                </div>

                {/* Statut */}
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 ${status.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <span className="material-icons">schedule</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Statut actuel</p>
                    <p className="font-medium text-gray-900">{status.label}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'édition */}
      {isEditModalOpen && (
        <CreateEventModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          eventToEdit={event}
          onEventCreated={() => {
            setIsEditModalOpen(false);
            fetchEventDetails();
          }}
        />
      )}

      {/* Modal de confirmation de suppression */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 m-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="material-icons text-red-600">warning</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Supprimer l'événement</h3>
                <p className="text-sm text-gray-600">
                  Êtes-vous sûr de vouloir supprimer "{event.titre}" ? Cette action est irréversible.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
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

export default EventDetailsPage;