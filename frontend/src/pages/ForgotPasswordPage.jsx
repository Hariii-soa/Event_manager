
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';

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
    <AuthLayout
      sideContent={
        <>
          <img
            src="/auth.png"
            alt="Sécurité"
            className="w-full max-w-xs sm:max-w-sm md:max-w-lg mb-4 sm:mb-6 shadow-lg rounded-xl mx-auto"
          />
          <h2 className="mb-2 sm:mb-3 text-xl sm:text-2xl font-bold text-gray-800 px-4">
            Sécurisez votre compte
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-gray-600 px-4">
            Réinitialisez votre mot de passe en toute sécurité et reprenez le contrôle de votre compte Evenia.
          </p>
        </>
      }
    >
      <div className="w-full">
        <h1 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold text-gray-800">
          Mot de passe oublié ?
        </h1>
        <p className="mb-6 text-sm sm:text-base text-gray-600">
          Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <span className="material-icons text-red-600 text-sm">error</span>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

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
            <div>
              <label className="flex items-center mb-2 text-sm sm:text-base text-gray-700">
                <span className="mr-2 text-lg sm:text-xl material-icons">email</span>
                Adresse email
              </label>
              <input
                type="email"
                name="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 sm:py-3 text-sm sm:text-base rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm sm:text-base text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1"
          >
            <span className="material-icons text-sm">arrow_back</span>
            Retour à la connexion
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;