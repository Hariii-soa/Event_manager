import React, { useState } from 'react';
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
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  // ✅ Validation du téléphone (exactement 10 chiffres)
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  // ✅ Validation du mot de passe (minimum 8 caractères)
  const validatePassword = (password) => {
    return password.length >= 8;
  };

  // ✅ Validation de l'email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // ✅ Gestion du changement avec validation en temps réel
  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Convertir le nom en majuscules automatiquement
    if (name === 'nom') {
      processedValue = value.toUpperCase();
    }

    setFormData({ ...formData, [name]: processedValue });

    // Validation en temps réel
    const errors = { ...fieldErrors };

    if (name === 'tel' && processedValue && !validatePhone(processedValue)) {
      errors.tel = 'Le numéro doit contenir exactement 10 chiffres';
    } else if (name === 'tel') {
      delete errors.tel;
    }

    if (name === 'motDePasse' && processedValue && !validatePassword(processedValue)) {
      errors.motDePasse = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (name === 'motDePasse') {
      delete errors.motDePasse;
    }

    if (name === 'confirmPassword' && processedValue !== formData.motDePasse) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    } else if (name === 'confirmPassword') {
      delete errors.confirmPassword;
    }

    if (name === 'email' && processedValue && !validateEmail(processedValue)) {
      errors.email = 'Email invalide';
    } else if (name === 'email') {
      delete errors.email;
    }

    setFieldErrors(errors);
  };

  // ✅ Validation avant soumission
  const validateForm = () => {
    const errors = {};

    if (type === 'register') {
      if (!formData.nom) errors.nom = 'Le nom est requis';
      if (!formData.prenom) errors.prenom = 'Le prénom est requis';
      
      if (!formData.tel) {
        errors.tel = 'Le numéro de téléphone est requis';
      } else if (!validatePhone(formData.tel)) {
        errors.tel = 'Le numéro doit contenir exactement 10 chiffres';
      }

      if (!validatePassword(formData.motDePasse)) {
        errors.motDePasse = 'Le mot de passe doit contenir au moins 8 caractères';
      }

      if (formData.motDePasse !== formData.confirmPassword) {
        errors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }

    if (!formData.email) {
      errors.email = 'L\'email est requis';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Email invalide';
    }

    if (!formData.motDePasse) {
      errors.motDePasse = 'Le mot de passe est requis';
    } else if (type === 'login' && formData.motDePasse.length < 8) {
      errors.motDePasse = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ✅ Valider le formulaire avant soumission
    if (!validateForm()) {
      setError('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    if (type === 'register') {
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
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <span className="material-icons text-red-600 text-sm">error</span>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'register' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center mb-2 text-sm sm:text-base text-gray-700">
                <span className="mr-2 text-lg sm:text-xl material-icons">person</span>
                Nom <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="nom"
                placeholder="VOTRE NOM"
                value={formData.nom}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-lg focus:outline-none uppercase ${
                  fieldErrors.nom ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-blue-400'
                }`}
                required
              />
              {fieldErrors.nom && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <span className="material-icons text-xs">error</span>
                  {fieldErrors.nom}
                </p>
              )}
              
            </div>
            <div>
              <label className="flex items-center mb-2 text-sm sm:text-base text-gray-700">
                <span className="mr-2 text-lg sm:text-xl material-icons">person</span>
                Prénom <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="prenom"
                placeholder="Votre prénom"
                value={formData.prenom}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-lg focus:outline-none ${
                  fieldErrors.prenom ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-blue-400'
                }`}
                required
              />
              {fieldErrors.prenom && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <span className="material-icons text-xs">error</span>
                  {fieldErrors.prenom}
                </p>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="flex items-center mb-2 text-sm sm:text-base text-gray-700">
            <span className="mr-2 text-lg sm:text-xl material-icons">email</span>
            Email <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="votre@email.com"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-lg focus:outline-none ${
              fieldErrors.email ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-blue-400'
            }`}
            required
          />
          {fieldErrors.email && (
            <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
              <span className="material-icons text-xs">error</span>
              {fieldErrors.email}
            </p>
          )}
        </div>

        {type === 'register' && (
          <div>
            <label className="flex items-center mb-2 text-sm sm:text-base text-gray-700">
              <span className="mr-2 text-lg sm:text-xl material-icons">phone</span>
              Numéro de téléphone <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="tel"
              name="tel"
              placeholder="0612345678"
              value={formData.tel}
              onChange={handleChange}
              maxLength="10"
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-lg focus:outline-none ${
                fieldErrors.tel ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-blue-400'
              }`}
              required
            />
            {fieldErrors.tel && (
              <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <span className="material-icons text-xs">error</span>
                {fieldErrors.tel}
              </p>
            )}
            <p className="text-gray-500 text-xs mt-1">Format: 10 chiffres (exemple: 0612345678)</p>
          </div>
        )}

        <div>
          <label className="flex items-center mb-2 text-sm sm:text-base text-gray-700">
            <span className="mr-2 text-lg sm:text-xl material-icons">lock</span>
            Mot de passe <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="password"
            name="motDePasse"
            placeholder="••••••••"
            value={formData.motDePasse}
            onChange={handleChange}
            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-lg focus:outline-none ${
              fieldErrors.motDePasse ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-blue-400'
            }`}
            required
          />
          {fieldErrors.motDePasse && (
            <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
              <span className="material-icons text-xs">error</span>
              {fieldErrors.motDePasse}
            </p>
          )}
          <p className="text-gray-500 text-xs mt-1">Minimum 8 caractères</p>
        </div>

        {type === 'register' && (
          <div>
            <label className="flex items-center mb-2 text-sm sm:text-base text-gray-700">
              <span className="mr-2 text-lg sm:text-xl material-icons">lock</span>
              Confirmer mot de passe <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-lg focus:outline-none ${
                fieldErrors.confirmPassword ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-blue-400'
              }`}
              required
            />
            {fieldErrors.confirmPassword && (
              <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <span className="material-icons text-xs">error</span>
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>
        )}

        {type === 'login' && (
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Mot de passe oublié ?
            </Link>
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