// src/pages/ActivitesPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import AdminPasswordModal from '../components/modal/AdminPasswordModal';

const ActivitesPage = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(true);
  const [evenements, setEvenements] = useState([]);
  const [selectedEvenement, setSelectedEvenement] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const getToken = () => {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.error('❌ Erreur récupération token:', error);
      return null;
    }
  };

  // Charger tous les événements
  const fetchEvenements = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      const response = await fetch('http://localhost:3000/api/activites/evenements', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des événements');
      }

      const data = await response.json();
      setEvenements(data);
      console.log('✅ Événements chargés:', data.length);
    } catch (error) {
      console.error('❌ Erreur fetchEvenements:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchEvenements();
    }
  }, [isAdminAuthenticated, fetchEvenements]);

  // Charger les participants d'un événement
  const handleSelectEvenement = async (id_evenement) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccessMessage('');
      const token = getToken();

      const response = await fetch(
        `http://localhost:3000/api/activites/evenement/${id_evenement}/participants`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des participants');
      }

      const data = await response.json();
      setSelectedEvenement(data.evenement);
      setParticipants(data.participants);
      console.log('✅ Participants chargés:', data.participants.length);
    } catch (error) {
      console.error('❌ Erreur handleSelectEvenement:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Accepter une participation
  const handleAccepter = async (id_participation, participantName) => {
    if (!window.confirm(`Accepter l'inscription de ${participantName} ?\n\nUn email de confirmation sera envoyé.`)) {
      return;
    }

    try {
      setIsLoading(true);
      const token = getToken();
      const response = await fetch(
        `http://localhost:3000/api/activites/participation/${id_participation}/accepter`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de l\'acceptation');
      }

      console.log('✅ Participation acceptée');
      setSuccessMessage(`✅ Inscription de ${participantName} acceptée ! Un email de confirmation a été envoyé.`);
      
      if (selectedEvenement) {
        handleSelectEvenement(selectedEvenement.id_evenement);
      }

      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('❌ Erreur handleAccepter:', error);
      setError(error.message);
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Refuser une participation
  const handleRefuser = async (id_participation, participantName) => {
    const raison = prompt(`Refuser l'inscription de ${participantName}\n\nVeuillez indiquer la raison du refus (optionnel):`);
    
    if (raison === null) return; // Annulation

    try {
      setIsLoading(true);
      const token = getToken();

      const response = await fetch(
        `http://localhost:3000/api/activites/participation/${id_participation}/refuser`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ raison: raison || 'Aucune raison spécifiée' })
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors du refus');
      }

      console.log('✅ Participation refusée');
      setSuccessMessage(`❌ Inscription de ${participantName} refusée. Un email a été envoyé avec la raison du refus.`);
      
      if (selectedEvenement) {
        handleSelectEvenement(selectedEvenement.id_evenement);
      }

      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('❌ Erreur handleRefuser:', error);
      setError(error.message);
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer les participants selon la recherche
  const filteredParticipants = participants.filter(p =>
    p.prenom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.telephone?.includes(searchQuery)
  );

  if (!isAdminAuthenticated) {
    return (
      <AdminPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={() => {
          setIsAdminAuthenticated(true);
          setIsPasswordModalOpen(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header avec couleur #F4CFDF */}
      <div style={{ backgroundColor: '#F4CFDF' }} className="text-gray-900 px-8 py-8 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <span className="material-icons text-4xl">bolt</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">Gestion des Activités</h1>
            <p className="text-gray-700 text-lg">Gérez tous vos participants et activités</p>
          </div>
        </div>
      </div>

      {/* Section principale */}
      <div className="px-8 py-8">
        {/* Messages de succès */}
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-400 text-green-800 px-6 py-4 rounded-lg mb-6 flex items-center gap-3 shadow-md animate-fade-in">
            <span className="material-icons text-green-500">check_circle</span>
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-800 px-6 py-4 rounded-lg mb-6 flex items-center gap-3 shadow-md">
            <span className="material-icons text-red-500">error</span>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Carte principale avec design moderne */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* En-tête de la carte avec couleur #B6D8F2 */}
          <div style={{ backgroundColor: '#B6D8F2' }} className="px-8 py-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Liste des Participants</h2>
            <p className="text-gray-700">Sélectionnez un événement pour voir les participants</p>
          </div>

          <div className="p-8">
            {/* Sélecteur d'événement */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="material-icons text-indigo-500">event</span>
                Sélectionner un événement
              </label>
              
              <div className="relative">
                <select
                  value={selectedEvenement?.id_evenement || ''}
                  onChange={(e) => {
                    const id = parseInt(e.target.value);
                    if (id) {
                      handleSelectEvenement(id);
                    } else {
                      setSelectedEvenement(null);
                      setParticipants([]);
                    }
                  }}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-pink-200 focus:border-pink-400 outline-none text-base font-medium bg-white appearance-none cursor-pointer hover:border-pink-300 transition-all shadow-sm"
                >
                  <option value="">Choisissez un événement dans la liste</option>
                  {evenements.map((evt) => (
                    <option key={evt.id_evenement} value={evt.id_evenement}>
                      {evt.titre} • Code: {evt.code_evenement} • {evt.nombre_participants_actuels}/{evt.nombre_places} participants
                    </option>
                  ))}
                </select>
                <span className="material-icons absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-2xl">
                  expand_more
                </span>
              </div>

              {/* Informations sur l'événement sélectionné */}
              {selectedEvenement && (
                <div className="mt-4 p-5 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border-2 border-pink-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Événement sélectionné</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedEvenement.titre}</p>
                      <p className="text-sm text-pink-600 font-medium mt-1">
                        Code: {selectedEvenement.code_evenement}
                      </p>
                    </div>
                    <div className="text-center bg-white px-6 py-4 rounded-xl shadow-md">
                      <p className="text-3xl font-bold text-pink-500">{filteredParticipants.length}</p>
                      <p className="text-xs text-gray-600 font-medium">participant{filteredParticipants.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Barre de recherche */}
            {selectedEvenement && participants.length > 0 && (
              <div className="mb-6">
                <div className="relative">
                  <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Rechercher un participant par nom, prénom, email ou téléphone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-4 w-full border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-pink-200 focus:border-pink-400 outline-none text-sm hover:border-pink-300 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Tableau des participants */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-400 rounded-full animate-spin"></div>
                  <p className="text-gray-600 font-medium">Chargement des participants...</p>
                </div>
              </div>
            ) : selectedEvenement ? (
              filteredParticipants.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-icons text-6xl text-gray-400">people_outline</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">Aucun participant</h3>
                  <p className="text-gray-500">
                    {searchQuery ? 'Aucun résultat pour votre recherche' : 'Aucun participant inscrit pour cet événement'}
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border-2 border-gray-200 shadow-lg">
                  <table className="w-full">
                    <thead>
                      <tr style={{ backgroundColor: '#B6D8F2' }} className="text-gray-900">
                        <th className="px-6 py-4 text-left text-sm font-bold">Code</th>
                        <th className="px-6 py-4 text-left text-sm font-bold">Nom</th>
                        <th className="px-6 py-4 text-left text-sm font-bold">Prénom</th>
                        <th className="px-6 py-4 text-left text-sm font-bold">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-bold">Téléphone</th>
                        <th className="px-6 py-4 text-center text-sm font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredParticipants.map((participant, index) => (
                        <tr 
                          key={participant.id_participation}
                          className={`${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          } hover:bg-pink-50 transition-colors`}
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {selectedEvenement.code_evenement}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {participant.nom}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {participant.prenom}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {participant.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {participant.telephone}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {participant.statut === 'en attente' ? (
                                <>
                                  <button
                                    onClick={() => handleAccepter(participant.id_participation, `${participant.prenom} ${participant.nom}`)}
                                    disabled={isLoading}
                                    className="flex items-center gap-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Accepter l'inscription et envoyer un email de confirmation"
                                  >
                                    <span className="material-icons text-sm">check</span>
                                    Accepter
                                  </button>
                                  <button
                                    onClick={() => handleRefuser(participant.id_participation, `${participant.prenom} ${participant.nom}`)}
                                    disabled={isLoading}
                                    className="flex items-center gap-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Refuser l'inscription et envoyer un email de refus"
                                  >
                                    <span className="material-icons text-sm">close</span>
                                    Refuser
                                  </button>
                                </>
                              ) : participant.statut === 'accepté' ? (
                                <span className="inline-flex items-center gap-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                                  <span className="material-icons text-sm">check_circle</span>
                                  Déjà accepté
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                                  <span className="material-icons text-sm">cancel</span>
                                  Déjà refusé
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-icons text-6xl text-pink-400">event</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">Sélectionnez un événement</h3>
                <p className="text-gray-500">Choisissez un événement dans la liste pour voir ses participants</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitesPage;