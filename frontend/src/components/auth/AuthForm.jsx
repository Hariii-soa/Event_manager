// src/components/auth/AuthForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const AuthForm = ({ type }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    tel: '',
    motDePasse: '',
    confirmPassword: '',
  });
  const { login } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gestion de la connexion Google OAuth
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userStr = urlParams.get('user');
  
    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Nettoyer l'URL
        window.history.replaceState({}, document.title, '/');
        
        // Rediriger
        window.location.href = '/dashboard/mes-evenements';
      } catch (error) {
        console.error('Erreur parsing user:', error);
        setError('Erreur lors de la connexion avec Google');
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (type === 'register') {
      if (formData.motDePasse !== formData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }

      const body = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        tel: formData.tel,
        motDePasse: formData.motDePasse,
      };

      try {
        const res = await fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Échec de l\'inscription');
        }

        navigate('/login');
      } catch (err) {
        setError(err.message);
      }
    } else {
      const body = {
        email: formData.email,
        motDePasse: formData.motDePasse,
      };

      try {
        const res = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Échec de la connexion');
        }

         // ✅ Utiliser login avec le bon ordre : userData, token
        login(data.user, data.token);
        navigate('/');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/auth/google';
  };

  return (
    <div className="w-full">
      <h1 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold text-gray-800">
        {type === 'register' ? 'Créer un compte' : 'Se connecter'}
      </h1>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'register' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center mb-2 text-sm sm:text-base text-gray-700">
                <span className="mr-2 text-lg sm:text-xl material-icons">person</span>
                Nom
              </label>
              <input
                type="text"
                name="nom"
                placeholder="Votre nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                required
              />
            </div>
            <div>
              <label className="flex items-center mb-2 text-sm sm:text-base text-gray-700">
                <span className="mr-2 text-lg sm:text-xl material-icons">person</span>
                Prénom
              </label>
              <input
                type="text"
                name="prenom"
                placeholder="Votre prénom"
                value={formData.prenom}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                required
              />
            </div>
          </div>
        )}

        <div>
          <label className="flex items-center mb-2 text-sm sm:text-base text-gray-700">
            <span className="mr-2 text-lg sm:text-xl material-icons">email</span>
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="votre@email.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
            required
          />
        </div>

        <div>
          <label className="flex items-center mb-2 text-sm sm:text-base text-gray-700">
            <span className="mr-2 text-lg sm:text-xl material-icons">lock</span>
            Mot de passe
          </label>
          <input
            type="password"
            name="motDePasse"
            placeholder="••••••••"
            value={formData.motDePasse}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
            required
          />
        </div>

        {type === 'register' && (
          <div>
            <label className="flex items-center mb-2 text-sm sm:text-base text-gray-700">
              <span className="mr-2 text-lg sm:text-xl material-icons">lock</span>
              Confirmer mot de passe
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[#60A5FA] hover:bg-blue-600 text-white font-semibold py-2.5 sm:py-3 text-sm sm:text-base rounded-lg transition"
        >
          {type === 'register' ? 'Créer mon compte' : 'Se connecter'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="mb-3 text-sm sm:text-base text-gray-600">Ou continuer avec</p>
        <div className="flex justify-center gap-3">
          <button 
            onClick={handleGoogleLogin}
            type="button"
            className="flex items-center gap-2 px-6 sm:px-10 py-2 text-sm sm:text-base border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-8 h-8 sm:w-10 sm:h-10" />
            Google
          </button>
        </div>
      </div>
      <p className="mt-6 text-center text-sm sm:text-base">
        {type === 'register' ? 'Déjà un compte ? ' : 'Pas de compte ? '}
        <Link
          to={type === 'register' ? '/login' : '/register'}
          className="font-semibold text-pink-600 hover:underline"
        >
          {type === 'register' ? 'Connectez-vous' : 'Inscrivez-vous'}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
