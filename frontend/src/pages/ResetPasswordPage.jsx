import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nouveauMotDePasse: '',
    confirmMotDePasse: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);

  // Vérifier la validité du token au chargement
  useEffect(() => {
    const verifyToken = async () => {
      try {
        setIsVerifying(true);
        console.log('🔍 Vérification du token...');

        // ✅ CORRECTION: Utiliser la bonne route du backend
        const response = await fetch(`http://localhost:3000/api/password-reset/verify/${token}`);
        const data = await response.json();

        if (!response.ok || !data.valid) {
          throw new Error(data.error || 'Token invalide ou expiré');
        }

        setTokenValid(true);
        console.log('✅ Token valide');
      } catch (err) {
        console.error('❌ Token invalide:', err);
        setError(err.message);
        setTokenValid(false);
      } finally {
        setIsVerifying(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setError('Token manquant');
      setIsVerifying(false);
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      // Validations
      if (!formData.nouveauMotDePasse || !formData.confirmMotDePasse) {
        setError('Veuillez remplir tous les champs');
        setIsLoading(false);
        return;
      }

      if (formData.nouveauMotDePasse.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères');
        setIsLoading(false);
        return;
      }

      if (formData.nouveauMotDePasse !== formData.confirmMotDePasse) {
        setError('Les mots de passe ne correspondent pas');
        setIsLoading(false);
        return;
      }

      console.log('🔒 Réinitialisation du mot de passe...');

      // ✅ CORRECTION: Utiliser la bonne route du backend
      const response = await fetch('http://localhost:3000/api/password-reset/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          nouveauMotDePasse: formData.nouveauMotDePasse
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la réinitialisation');
      }

      setSuccess(true);
      console.log('✅ Mot de passe réinitialisé');

      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('❌ Erreur:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // État de vérification du token
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <span className="material-icons text-6xl text-blue-500 animate-spin mb-4">refresh</span>
          <p className="text-gray-600">Vérification du lien...</p>
        </div>
      </div>
    );
  }

  // Token invalide
  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 to-blue-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-icons text-5xl text-red-500">error</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lien invalide ou expiré</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/forgot-password"
            className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
          >
            Faire une nouvelle demande
          </Link>
        </div>
      </div>
    );
  }

  // Formulaire de réinitialisation
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 to-blue-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
            <img src="/logo.png" alt="Evenia" className="w-14 h-14" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Evenia</h1>
            <p className="text-sm text-gray-500">Gestion d'événements</p>
          </div>
        </div>

        {/* Titre */}
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Nouveau mot de passe
        </h2>
        <p className="text-gray-600 mb-6">
          Créez un mot de passe sécurisé d'au moins 6 caractères.
        </p>

        {/* Message d'erreur */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <span className="material-icons text-red-600 text-sm">error</span>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Message de succès */}
        {success ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="material-icons text-green-600">check_circle</span>
                </div>
                <h3 className="font-semibold text-green-800">Mot de passe réinitialisé !</h3>
              </div>
              <p className="text-sm text-green-700 leading-relaxed mb-2">
                Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </p>
              <p className="text-xs text-green-600">
                Redirection automatique dans 3 secondes...
              </p>
            </div>

            <Link
              to="/login"
              className="block w-full text-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
            >
              Se connecter maintenant
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nouveau mot de passe */}
            <div>
              <label className="flex items-center mb-2 text-gray-700">
                <span className="material-icons mr-2">lock</span>
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="nouveauMotDePasse"
                  placeholder="••••••••"
                  value={formData.nouveauMotDePasse}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 pr-10"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  <span className="material-icons text-sm">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
            </div>

            {/* Confirmer le mot de passe */}
            <div>
              <label className="flex items-center mb-2 text-gray-700">
                <span className="material-icons mr-2">lock</span>
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmMotDePasse"
                  placeholder="••••••••"
                  value={formData.confirmMotDePasse}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  <span className="material-icons text-sm">
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="material-icons animate-spin text-sm">refresh</span>
                  Réinitialisation...
                </>
              ) : (
                <>
                  <span className="material-icons text-sm">lock_reset</span>
                  Réinitialiser le mot de passe
                </>
              )}
            </button>
          </form>
        )}

        {/* Lien retour */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1"
          >
            <span className="material-icons text-sm">arrow_back</span>
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;