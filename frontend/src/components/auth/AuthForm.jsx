// src/components/auth/AuthForm.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
//import { useAuth } from './context/AuthContext';
import { useAuth } from "@/context/useAuth.js";


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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (type === 'register') {
      if (formData.motDePasse !== formData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }

      // Envoi des données EXACTEMENT comme le backend les attend
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

        console.log('Inscription réussie:', data);
        navigate('/login');
      } catch (err) {
        setError(err.message);
      }
    } else {
      // Login
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
        
        console.log('useAuth fonctionne dans AuthForm !');

        if (!res.ok) {
          throw new Error(data.error || 'Échec de la connexion');
        }

        console.log('Connexion réussie:', data);
        login(data.user, data.token); // Stocke user + token
        //navigate('/');
        navigate('/');
      } catch (err) {
        setError(err.message);
      }

      useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const userStr = urlParams.get('user');
  
  if (token && userStr) {
    const user = JSON.parse(decodeURIComponent(userStr));
    login(user, token);  // Utilise ton hook useAuth
    // Nettoie l'URL
    window.history.replaceState({}, document.title, window.location.pathname);
    navigate('/');  // Redirige vers dashboard
  }
}, []);  // S'exécute au mount
    }
  };

  const handleGoogleLogin = () => {
  // Redirige vers backend pour initier OAuth
  window.location.href = 'http://localhost:3000/api/auth/google';
};

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-gray-800">
        {type === 'register' ? 'Rejoignez-nous' : 'Connectez-vous'}
      </h1>
      <p className="mb-8 text-gray-600">
        {type === 'register' ? 'Créez votre compte pour commencer' : 'Accédez à votre compte'}
      </p>

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {type === 'register' && (
          <>
            <div>
              <label className="flex items-center mb-2 text-gray-700">
                <span className="mr-2 text-xl material-icons">person</span>
                Nom
              </label>
              <input
                type="text"
                name="nom"
                placeholder="Votre nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                required
              />
            </div>

            <div>
              <label className="flex items-center mb-2 text-gray-700">
                <span className="mr-2 text-xl material-icons">person_outline</span>
                Prénom
              </label>
              <input
                type="text"
                name="prenom"
                placeholder="Votre prénom"
                value={formData.prenom}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                required
              />
            </div>

            <div>
              <label className="flex items-center mb-2 text-gray-700">
                <span className="mr-2 text-xl material-icons">phone</span>
                Téléphone
              </label>
              <input
                type="tel"
                name="tel"
                placeholder="Votre numéro"
                value={formData.tel}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                required
              />
            </div>
          </>
        )}

        <div>
          <label className="flex items-center mb-2 text-gray-700">
            <span className="mr-2 text-xl material-icons">email</span>
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="votre@email.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
            required
          />
        </div>

        <div>
          <label className="flex items-center mb-2 text-gray-700">
            <span className="mr-2 text-xl material-icons">lock</span>
            Mot de passe
          </label>
          <input
            type="password"
            name="motDePasse"
            placeholder="••••••••"
            value={formData.motDePasse}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
            required
          />
        </div>

        {type === 'register' && (
          <div>
            <label className="flex items-center mb-2 text-gray-700">
              <span className="mr-2 text-xl material-icons">lock</span>
              Confirmer mot de passe
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[#60A5FA] hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
        >
          {type === 'register' ? 'Créer mon compte' : 'Se connecter'}
        </button>
      </form>

      {/* ... reste du code (Google, Yahoo, lien) */}
      <div className="mt-6 text-center">
        <p className="mb-3 text-gray-600">Ou continuer avec</p>
       <div className="flex justify-center gap-3">
          <button 
      onClick={handleGoogleLogin}
      className="flex items-center gap-2 px-10 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
    >
      <img src="https://www.google.com/favicon.ico" alt="Google" className="w-10 h-10" />
      Google
    </button>
          
        </div>
      </div>
       <p className="mt-6 text-center">
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