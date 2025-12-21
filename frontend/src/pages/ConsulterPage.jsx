// src/pages/ConsulterPage.jsx - VERSION CORRIGÉE
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ConsulterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [participant, setParticipant] = useState(null);
  const [evenements, setEvenements] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);

  // Récupérer le token
  const getToken = () => {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.error('Erreur récupération token:', error);
      return null;
    }
  };

  // Valider l'email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // ✅ FONCTION DE RECHERCHE CORRIGÉE
  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setIsSearching(true);

    try {
      if (!email) {
        setError('Veuillez entrer votre email');
        setIsSearching(false);
        return;
      }

      if (!isValidEmail(email)) {
        setError('Email invalide');
        setIsSearching(false);
        return;
      }

      const token = getToken();
      if (!token) {
        setError('Session expirée. Veuillez vous reconnecter.');
        setIsSearching(false);
        return;
      }

      console.log('🔍 Recherche des participations pour:', email);
      console.log('🔑 Token présent:', token ? 'Oui' : 'Non');

      const response = await fetch(
        `http://localhost:3000/api/participant/mes-participations?email=${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('📡 Réponse statut:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la recherche');
      }

      const data = await response.json();
      console.log('✅ Données reçues:', data);
      console.log('✅ Nombre d\'événements:', data.length);

      // ✅ CORRECTION PRINCIPALE: Extraire les infos du participant correctement
      if (data.length > 0) {
        // Si des événements existent, récupérer prenom et nom du premier
        const firstEvent = data[0];
        console.log('📋 Premier événement:', firstEvent);
        console.log('👤 Prénom:', firstEvent.prenom, '| Nom:', firstEvent.nom);

        setParticipant({
          email: email,
          prenom: firstEvent.prenom || '',
          nom: firstEvent.nom || ''
        });
      } else {
        // Aucun événement trouvé
        setParticipant({
          email: email,
          prenom: '',
          nom: ''
        });
      }

      setEvenements(data);
      setHasSearched(true);
      setIsModalOpen(false);

    } catch (err) {
      console.error('❌ Erreur recherche:', err);
      setError(err.message);
    } finally {
      setIsSearching(false);
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

  // Obtenir le badge de statut
  const getStatusBadge = (dateEvenement) => {
    const eventDate = new Date(dateEvenement);
    const now = new Date();
    const diffTime = eventDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: 'Terminé', color: 'bg-gray-100 text-gray-600' };
    } else if (diffDays === 0) {
      return { label: 'En cours', color: 'bg-green-100 text-green-700' };
    } else {
      return { label: 'À venir', color: 'bg-blue-100 text-blue-700' };
    }
  };

  // Réinitialiser la recherche
  const handleNewSearch = () => {
    setEmail('');
    setParticipant(null);
    setEvenements([]);
    setHasSearched(false);
    setError('');
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal de recherche */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header du modal */}
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 px-6 py-5 flex items-center gap-4">
              <div className="w-14 h-14 bg-white/80 rounded-full flex items-center justify-center">
                <span className="material-icons  bg-pink-200 text-3xl">person_search</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Rechercher un participant</h2>
                <p className="text-sm text-gray-700">Saisissez l'email du participant</p>
              </div>
            </div>

            {/* Formulaire de recherche */}
            <form onSubmit={handleSearch} className="p-6 space-y-5">

              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <span className="material-icons text-sm">error</span>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="material-icons text-base text-gray-600">email</span>
                  Email du participant
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-200 focus:border-pink-400 outline-none transition text-sm"
                  disabled={isSearching}
                  autoFocus
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/participer')}
                  disabled={isSearching}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium text-sm disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="flex-1 px-6 py-3 bg-gradient-to-r bg-pink-300 text-white rounded-xl hover:from-pink-300 hover:to-purple-300 transition font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSearching ? (
                    <>
                      <span className="material-icons animate-spin text-sm">refresh</span>
                      Recherche...
                    </>
                  ) : (
                    <>
                      <span className="material-icons text-sm">search</span>
                      Rechercher
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ AFFICHAGE DES RÉSULTATS CORRIGÉ */}
      {hasSearched && participant && (
        <>
          {/* Header avec informations du participant */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-6">
            <div className="max-w-7xl mx-auto">
              <button
                onClick={handleNewSearch}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
              >
                <span className="material-icons">arrow_back</span>
                <span className="font-medium">Retour à la recherche</span>
              </button>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
                    <span className="material-icons text-pink-500 text-3xl">person</span>
                  </div>
                  <div>
                    {/* ✅ AFFICHAGE CONDITIONNEL DU NOM */}
                    {participant.prenom && participant.nom ? (
                      <>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                          {participant.prenom} {participant.nom}
                        </h1>
                        <p className="text-gray-600">Email: {participant.email}</p>
                      </>
                    ) : (
                      <>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Participant</h1>
                        <p className="text-gray-600">Email: {participant.email}</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="bg-blue-50 px-6 py-3 rounded-xl">
                  <p className="text-sm text-gray-600">Événements inscrits</p>
                  <p className="text-2xl font-bold text-blue-600">{evenements.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section des événements */}
          <div className="px-4 sm:px-8 py-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Événements auxquels ce participant participe
              </h2>

              {evenements.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-icons text-6xl text-gray-400">event_busy</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">Aucun événement trouvé</h3>
                  <p className="text-gray-500 mb-6">
                    Ce participant n'est inscrit à aucun événement pour le moment.
                  </p>
                  <button
                    onClick={handleNewSearch}
                    className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition font-medium"
                  >
                    Rechercher un autre participant
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {evenements.map((event) => {
                    const status = getStatusBadge(event.date_evenement);
                    return (
                      <div
                        key={event.id_evenement}
                        className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden"
                      >
                        <div className="flex flex-col sm:flex-row">
                          {/* Image de l'événement */}
                          <div className="relative h-48 sm:h-auto sm:w-64 flex-shrink-0">
                            {event.image_url ? (
                              <img
                                src={`http://localhost:3000${event.image_url}`}
                                alt={event.titre}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                                <span className="material-icons text-6xl text-gray-400">event</span>
                              </div>
                            )}
                            <div className="absolute top-3 left-3">
                              <span className={`px-3 py-1 ${status.color} rounded-full text-xs font-medium backdrop-blur-sm`}>
                                {status.label}
                              </span>
                            </div>
                          </div>

                          {/* Contenu de l'événement */}
                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                    #{event.code_evenement}
                                  </span>
                                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
                                    <span className="material-icons text-sm">check_circle</span>
                                    Participant inscrit
                                  </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.titre}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                              </div>
                            </div>

                            {/* Informations de l'événement */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="material-icons text-base text-blue-500">event</span>
                                <span className="line-clamp-1">{formatDate(event.date_evenement)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="material-icons text-base text-purple-500">location_on</span>
                                <span className="line-clamp-1">{event.lieu}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="material-icons text-base text-green-500">people</span>
                                <span>
                                  {event.nombre_participants_actuels || 0}/{event.nombre_places} participants
                                </span>
                              </div>
                            </div>

                            {/* Bouton pour voir les détails */}
                            <button
                              onClick={() => navigate(`/dashboard/evenement-details/${event.id_evenement}`)}
                              className="w-full sm:w-auto px-6 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition font-medium flex items-center justify-center gap-2"
                            >
                              <span className="material-icons text-sm">visibility</span>
                              Cliquer pour plus de détails
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ConsulterPage;