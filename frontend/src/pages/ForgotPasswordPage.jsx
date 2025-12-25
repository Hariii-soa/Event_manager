import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      if (!email) {
        setError('Veuillez entrer votre adresse email');
        setIsLoading(false);
        return;
      }

      // Validation email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Adresse email invalide');
        setIsLoading(false);
        return;
      }

      console.log('📧 Demande de réinitialisation pour:', email);

      // ✅ CORRECTION: Utiliser la bonne route du backend
      const response = await fetch('http://localhost:3000/api/password-reset/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la demande');
      }

      setSuccess(true);
      console.log('✅ Email envoyé');
    } catch (err) {
      console.error('❌ Erreur:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
          Mot de passe oublié ?
        </h2>
        <p className="text-gray-600 mb-6">
          Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
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
                  <span className="material-icons text-green-600">mark_email_read</span>
                </div>
                <h3 className="font-semibold text-green-800">Email envoyé !</h3>
              </div>
              <p className="text-sm text-green-700 leading-relaxed">
                Si un compte existe avec l'adresse <strong>{email}</strong>, vous recevrez un email contenant un lien pour réinitialiser votre mot de passe.
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="material-icons text-blue-600 text-sm mt-0.5">info</span>
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Quelques conseils :</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Vérifiez votre dossier spam si vous ne recevez pas l'email</li>
                    <li>Le lien est valable pendant 1 heure</li>
                    <li>Vous pouvez refaire une demande si nécessaire</li>
                  </ul>
                </div>
              </div>
            </div>

            <Link
              to="/login"
              className="block w-full text-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
            >
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Champ email */}
            <div>
              <label className="flex items-center mb-2 text-gray-700">
                <span className="material-icons mr-2">email</span>
                Adresse email
              </label>
              <input
                type="email"
                name="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                required
                disabled={isLoading}
              />
            </div>

            {/* Bouton d'envoi */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="material-icons animate-spin text-sm">refresh</span>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <span className="material-icons text-sm">send</span>
                  Envoyer le lien
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

export default ForgotPasswordPage;