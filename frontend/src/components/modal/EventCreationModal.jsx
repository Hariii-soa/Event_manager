// src/components/modal/EventCreationModal.jsx
import React, { useState, useRef } from 'react';

const CreateEventModal = ({ isOpen, onClose, onEventCreated }) => {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    code_evenement: '',
    titre: '',
    description: '',
    date_evenement: '',
    lieu: '',
    nombre_places: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Récupérer le token depuis localStorage
  const getToken = () => {
    try {
      return localStorage.getItem('token');
    } catch (err) {
      console.error('Erreur token:', err);
      return null;
    }
  };

  // Gérer les changements de champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gérer le changement d'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner une image valide');
        return;
      }

      // Vérifier la taille (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('L\'image ne doit pas dépasser 5MB');
        return;
      }

      setImageFile(file);
      
      // Créer un aperçu
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  // Déclencher le sélecteur de fichiers
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    const token = getToken();
    if (!token) {
      setError('Vous devez être connecté');
      setIsLoading(false);
      return;
    }

    try {
      // Validation côté client
      if (!formData.code_evenement || !formData.titre || !formData.date_evenement || 
          !formData.lieu || !formData.nombre_places) {
        setError('Veuillez remplir tous les champs obligatoires');
        setIsLoading(false);
        return;
      }

      // Créer un FormData pour l'upload
      const formDataToSend = new FormData();
      formDataToSend.append('code_evenement', formData.code_evenement);
      formDataToSend.append('titre', formData.titre);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('date_evenement', formData.date_evenement);
      formDataToSend.append('lieu', formData.lieu);
      formDataToSend.append('nombre_places', formData.nombre_places);
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      // Envoyer la requête
      const response = await fetch('http://localhost:3000/api/evenements', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de l\'événement');
      }

      // Succès
      setSuccess('Événement créé avec succès !');
      
      // Attendre 1.5 secondes puis fermer et rediriger
      setTimeout(() => {
        onClose();
        if (onEventCreated) {
          onEventCreated();
        }
        // Rediriger vers la page de listage
        window.location.href = '/dashboard/mes-evenements';
      }, 1500);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fermer le modal
  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        code_evenement: '',
        titre: '',
        description: '',
        date_evenement: '',
        lieu: '',
        nombre_places: ''
      });
      setImageFile(null);
      setImagePreview(null);
      setError('');
      setSuccess('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="sticky top-0 bg-pink-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <span className="material-icons text-gray-800">event</span>
            <h2 className="text-xl font-bold text-gray-800">
              Organiser un nouvel événement
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-600 hover:text-gray-800 transition disabled:opacity-50"
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <span className="material-icons">check_circle</span>
              {success}
            </div>
          )}

          {/* Code et Titre */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="material-icons text-xs align-middle mr-1">tag</span>
                Code de l&apos;événement *
              </label>
              <input
                type="text"
                name="code_evenement"
                value={formData.code_evenement}
                onChange={handleChange}
                placeholder="Ex: CONF2024"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de l&apos;événement *
              </label>
              <input
                type="text"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                placeholder="Ex: Conférence Tech 2024"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Décrivez votre événement..."
              rows="3"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition resize-none"
              disabled={isLoading}
            ></textarea>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="material-icons text-xs align-middle mr-1">event</span>
              Date de l&apos;événement *
            </label>
            <input
              type="datetime-local"
              name="date_evenement"
              value={formData.date_evenement}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
              required
              disabled={isLoading}
            />
          </div>

          {/* Lieu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="material-icons text-xs align-middle mr-1">location_on</span>
              Lieu *
            </label>
            <input
              type="text"
              name="lieu"
              value={formData.lieu}
              onChange={handleChange}
              placeholder="Ex: Salle de conférence A, Paris"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
              required
              disabled={isLoading}
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="material-icons text-xs align-middle mr-1">image</span>
              Image de l&apos;événement
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
              disabled={isLoading}
            />
            <div
              onClick={handleImageClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleImageClick();
                }
              }}
              className={`w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg ${!isLoading ? 'cursor-pointer hover:border-pink-500' : 'opacity-50'} transition text-center`}
            >
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  {!isLoading && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center rounded-lg">
                      <span className="text-white text-sm">Changer l&apos;image</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-4">
                  <span className="material-icons text-gray-400 text-4xl">add_photo_alternate</span>
                  <p className="text-gray-500 text-sm mt-2">
                    Choisir un fichier
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Aucun fichier choisi
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Nombre de places */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="material-icons text-xs align-middle mr-1">people</span>
              Nombre de places disponibles *
            </label>
            <input
              type="number"
              name="nombre_places"
              value={formData.nombre_places}
              onChange={handleChange}
              placeholder="Ex: 50"
              min="1"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
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
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="material-icons animate-spin text-sm">refresh</span>
                  Création...
                </>
              ) : (
                "Créer l'événement"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;