import React, { useState } from 'react';

const InscriptionModal = ({ isOpen, onClose, event, onSuccess }) => {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Gérer les changements de champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Valider le format de l'email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Valider le format du téléphone
  const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Validation côté client
      if (!formData.prenom || !formData.nom || !formData.email || !formData.telephone) {
        setError('Veuillez remplir tous les champs');
        setIsLoading(false);
        return;
      }

      if (!isValidEmail(formData.email)) {
        setError('Email invalide');
        setIsLoading(false);
        return;
      }

      if (!isValidPhone(formData.telephone)) {
        setError('Numéro de téléphone invalide (minimum 10 chiffres)');
        setIsLoading(false);
        return;
      }

      console.log('📝 Inscription à l\'événement:', event.id_evenement);
      console.log('📋 Données:', formData);

      // Envoyer la requête
      const response = await fetch(`http://localhost:3000/api/participant/inscrire/${event.id_evenement}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }

      // Succès
      setSuccess('Inscription réussie ! 🎉');
      console.log('✅ Inscription réussie:', data);

      // Attendre 2 secondes puis fermer
      setTimeout(() => {
        handleClose();
        if (onSuccess) {
          onSuccess();
        }
      }, 2000);

    } catch (err) {
      console.error('❌ Erreur inscription:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fermer le modal
  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        prenom: '',
        nom: '',
        email: '',
        telephone: ''
      });
      setError('');
      setSuccess('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-pink-50 px-4 sm:px-6 py-4 flex items-center justify-between rounded-t-2xl border-b border-pink-100">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="material-icons text-pink-600 text-sm">person_add</span>
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 line-clamp-1">
                Inscription à l'événement
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">{event.titre}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-600 hover:text-gray-800 transition disabled:opacity-50 flex-shrink-0 ml-2"
          >
            <span className="material-icons text-sm">close</span>
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2 text-sm">
              <span className="material-icons text-sm flex-shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-2 text-sm">
              <span className="material-icons text-sm flex-shrink-0">check_circle</span>
              <span>{success}</span>
            </div>
          )}

          {/* Champ Code (lecture seule) */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <span className="material-icons text-sm">tag</span>
              Code
            </label>
            <input
              type="text"
              value={event.code_evenement}
              readOnly
              className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed text-sm"
            />
          </div>

          {/* Champ Prénom */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <span className="material-icons text-sm">person</span>
              Prénom
            </label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              placeholder="Votre prénom"
              className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition text-sm"
              required
              disabled={isLoading}
            />
          </div>

          {/* Champ Nom */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <span className="material-icons text-sm">badge</span>
              Nom
            </label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Votre nom"
              className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition text-sm"
              required
              disabled={isLoading}
            />
          </div>

          {/* Champ Email */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <span className="material-icons text-sm">email</span>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre.email@example.com"
              className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition text-sm"
              required
              disabled={isLoading}
            />
          </div>

          {/* Champ Téléphone */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <span className="material-icons text-sm">phone</span>
              Téléphone
            </label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              placeholder="06 12 34 56 78"
              className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition text-sm"
              required
              disabled={isLoading}
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="material-icons animate-spin text-sm">refresh</span>
                  <span className="hidden sm:inline">Inscription...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">S'inscrire</span>
                  <span className="sm:hidden">OK</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InscriptionModal;