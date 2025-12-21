import React, { useState, useEffect, useCallback } from 'react';

// Modal de mot de passe admin
const AdminPasswordModal = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const getToken = () => {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.error('Erreur récupération token:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!password) {
        setError('Veuillez entrer le mot de passe administrateur');
        setIsLoading(false);
        return;
      }

      const token = getToken();
      if (!token) {
        setError('Session expirée. Veuillez vous reconnecter.');
        setIsLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3000/api/admin-auth/verify-admin-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adminPassword: password })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Mot de passe administrateur incorrect');
      }

      console.log('✅ Authentification admin réussie');
      
      if (onSuccess) {
        onSuccess();
      }
      
      setPassword('');
    } catch (err) {
      console.error('❌ Erreur authentification admin:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setPassword('');
    setError('');
    if (onClose) {
      onClose();
    }
    window.location.href = '/';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div style={{ backgroundColor: '#9AC8EB' }} className="px-6 py-5 flex items-center gap-4">
          <div className="w-14 h-14 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <span className="material-icons text-gray-800 text-3xl">admin_panel_settings</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Accès Administrateur</h2>
            <p className="text-sm text-gray-700">Authentification requise</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <span className="material-icons text-sm">error</span>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="material-icons text-base text-gray-600">lock</span>
              Mot de passe administrateur
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez le mot de passe admin"
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200  outline-none transition text-sm"
                disabled={isLoading}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                disabled={isLoading}
              >
                <span className="material-icons text-xl">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <span className="material-icons text-xs">info</span>
              Par défaut: Admin123@
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-400 text-white rounded-xl hover:from-blue-400 hover:to-blue-400 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="material-icons animate-spin text-sm">refresh</span>
                  Vérification...
                </>
              ) : (
                <>
                  <span className="material-icons text-sm">login</span>
                  Accéder
                </>
              )}
            </button>
          </div>
        </form>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center flex items-center justify-center gap-1">
            <span className="material-icons text-xs">security</span>
            Accès sécurisé réservé aux administrateurs uniquement
          </p>
        </div>
      </div>
    </div>
  );
};

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

  const handleSelectEvenement = async (id_evenement) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccessMessage('');
      const token = getToken();

      console.log('📋 Chargement des participants pour événement:', id_evenement);

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
      console.log('✅ Données reçues:', data);
      console.log('📋 Participants:', data.participants);

      setSelectedEvenement(data.evenement);
      setParticipants(data.participants);
      
      // Log pour déboguer
      data.participants.forEach(p => {
        console.log(`Participant ${p.prenom} ${p.nom}: statut = "${p.statut}"`);
      });
    } catch (error) {
      console.error('❌ Erreur handleSelectEvenement:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccepter = async (id_participation, participantName) => {
    if (!window.confirm(`Accepter l'inscription de ${participantName} ?\n\nUn email de confirmation sera automatiquement envoyé.`)) {
      return;
    }

    try {
      setIsLoading(true);
      const token = getToken();
      
      console.log('✅ Acceptation participation ID:', id_participation);
      
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
      setSuccessMessage(`Inscription de ${participantName} acceptée ! Un email de confirmation a été envoyé.`);
      
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

  const handleRefuser = async (id_participation, participantName) => {
    const raison = prompt(`Refuser l'inscription de ${participantName}\n\nVeuillez indiquer la raison du refus :\n(Cette raison sera envoyée par email)`);
    
    if (raison === null) return;

    try {
      setIsLoading(true);
      const token = getToken();

      console.log('❌ Refus participation ID:', id_participation);

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
      setSuccessMessage(`Inscription de ${participantName} refusée. Un email a été envoyé avec la raison du refus.`);
      
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

  const filteredParticipants = participants.filter(p =>
    p.prenom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.telephone?.includes(searchQuery)
  );

  const getStatusBadge = (statut) => {
    console.log('🏷️ Badge pour statut:', statut);
    
    switch (statut) {
      case 'accepté':
        return {
          label: 'Accepté',
          color: 'bg-green-100 text-green-700',
          icon: 'check_circle'
        };
      case 'refusé':
        return {
          label: 'Refusé',
          color: 'bg-red-100 text-red-700',
          icon: 'cancel'
        };
      case 'en attente':
      default:
        return {
          label: 'En attente',
          color: 'bg-yellow-100 text-yellow-700',
          icon: 'schedule'
        };
    }
  };

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
    <div className="min-h-screen bg-gray-50">
      <div style={{ backgroundColor: '#F4CFDF' }} className="text-gray-900 px-4 sm:px-8 py-6 sm:py-8 shadow-lg">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
            <span className="material-icons text-3xl sm:text-4xl">bolt</span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">Gestion des Activités</h1>
            <p className="text-sm sm:text-lg text-gray-700">Gérez tous vos participants et activités</p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 py-6 sm:py-8">
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-400 text-green-800 px-4 sm:px-6 py-3 sm:py-4 rounded-lg mb-6 flex items-center gap-3 shadow-md">
            <span className="material-icons text-green-500">check_circle</span>
            <span className="font-medium text-sm sm:text-base">{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-800 px-4 sm:px-6 py-3 sm:py-4 rounded-lg mb-6 flex items-center gap-3 shadow-md">
            <span className="material-icons text-red-500">error</span>
            <span className="font-medium text-sm sm:text-base">{error}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
          <div style={{ backgroundColor: '#B6D8F2' }} className="px-4 sm:px-8 py-4 sm:py-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Liste des Participants</h2>
            <p className="text-sm sm:text-base text-gray-700">Sélectionnez un événement pour voir les participants</p>
          </div>

          <div className="p-4 sm:p-8">
            <div className="mb-6 sm:mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
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
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-pink-200 focus:border-pink-400 outline-none text-sm sm:text-base font-medium bg-white appearance-none cursor-pointer hover:border-pink-300 transition-all shadow-sm"
                >
                  <option value="">Choisissez un événement dans la liste</option>
                  {evenements.map((evt) => (
                    <option key={evt.id_evenement} value={evt.id_evenement}>
                      {evt.titre} - Code: {evt.code_evenement} - {evt.nombre_participants_actuels}/{evt.nombre_places} participants
                    </option>
                  ))}
                </select>
                <span className="material-icons absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl sm:text-2xl">
                  expand_more
                </span>
              </div>

              {selectedEvenement && (
                <div className="mt-4 p-4 sm:p-5 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border-2 border-pink-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Événement sélectionné</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">{selectedEvenement.titre}</p>
                      <p className="text-xs sm:text-sm text-pink-600 font-medium mt-1">
                        Code: {selectedEvenement.code_evenement}
                      </p>
                    </div>
                    <div className="text-center bg-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-md">
                      <p className="text-2xl sm:text-3xl font-bold text-pink-500">{filteredParticipants.length}</p>
                      <p className="text-xs text-gray-600 font-medium">participant{filteredParticipants.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {selectedEvenement && participants.length > 0 && (
              <div className="mb-6">
                <div className="relative">
                  <span className="material-icons absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Rechercher un participant..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 sm:pl-12 pr-4 py-3 sm:py-4 w-full border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-pink-200 focus:border-pink-400 outline-none text-sm hover:border-pink-300 transition-all"
                  />
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-pink-200 border-t-pink-400 rounded-full animate-spin"></div>
                  <p className="text-gray-600 font-medium text-sm sm:text-base">Chargement des participants...</p>
                </div>
              </div>
            ) : selectedEvenement ? (
              filteredParticipants.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-icons text-5xl sm:text-6xl text-gray-400">people_outline</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">Aucun participant</h3>
                  <p className="text-sm sm:text-base text-gray-500">
                    {searchQuery ? 'Aucun résultat pour votre recherche' : 'Aucun participant inscrit pour cet événement'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-lg">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr style={{ backgroundColor: '#B6D8F2' }} className="text-gray-900">
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Nom</th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Prénom</th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Email</th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Téléphone</th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-bold">Statut</th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredParticipants.map((participant, index) => {
                        const statusBadge = getStatusBadge(participant.statut);
                        return (
                          <tr 
                            key={participant.id_participation}
                            className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-pink-50 transition-colors`}
                          >
                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                              {participant.nom}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">
                              {participant.prenom}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">
                              {participant.email}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">
                              {participant.telephone}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4">
                              <div className="flex justify-center">
                                <span className={`inline-flex items-center gap-1 px-3 py-1.5 ${statusBadge.color} rounded-lg text-xs font-medium`}>
                                  <span className="material-icons text-sm">{statusBadge.icon}</span>
                                  {statusBadge.label}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4">
                              <div className="flex items-center justify-center gap-2">
                                {participant.statut === 'en attente' ? (
                                  <>
                                    <button
                                      onClick={() => handleAccepter(participant.id_participation, `${participant.prenom} ${participant.nom}`)}
                                      disabled={isLoading}
                                      className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                      title="Accepter l'inscription et envoyer un email de confirmation"
                                    >
                                      <span className="material-icons text-sm">check</span>
                                      <span className="hidden sm:inline">Accepter</span>
                                    </button>
                                    <button
                                      onClick={() => handleRefuser(participant.id_participation, `${participant.prenom} ${participant.nom}`)}
                                      disabled={isLoading}
                                      className="flex items-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                      title="Refuser l'inscription et envoyer un email de refus"
                                    >
                                      <span className="material-icons text-sm">close</span>
                                      <span className="hidden sm:inline">Refuser</span>
                                    </button>
                                  </>
                                ) : participant.statut === 'accepté' ? (
                                  <span className="inline-flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                                    <span className="material-icons text-sm">check_circle</span>
                                    Déjà accepté
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-xs font-medium">
                                    <span className="material-icons text-sm">cancel</span>
                                    Déjà refusé
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-icons text-5xl sm:text-6xl text-pink-400">event</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">Sélectionnez un événement</h3>
                <p className="text-sm sm:text-base text-gray-500">Choisissez un événement dans la liste pour voir ses participants</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitesPage;